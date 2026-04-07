import { coerce, satisfies } from 'semver'
import { NonZeroExitError, x } from 'tinyexec'
import { log } from './log'

const OBSIDIAN_CLI_DOCS_URL = 'https://help.obsidian.md/cli'
const OBSIDIAN_CLI_VERSION = '^1.12.7'

/**
 * Error thrown when the Obsidian CLI returns a non-zero exit code or when CLI
 * command reports a logical error in stdout e.g. (the process exits 0 but
 * output starts with `Error:`).
 */
export class ObsidianError extends Error {
	readonly exitCode: number | undefined
	readonly stderr: string
	readonly stdout: string

	constructor(
		message: string,
		stderr: string,
		stdout: string,
		exitCode: number | undefined,
		options?: { cause?: unknown },
	) {
		super(message || stderr || stdout || 'Obsidian CLI command failed', options)
		this.name = 'ObsidianError'
		this.stderr = stderr
		this.stdout = stdout
		this.exitCode = exitCode
	}
}

/**
 * Error thrown when the Obsidian CLI binary is not found on the system PATH.
 */
export class ObsidianNotFoundError extends Error {
	constructor(binary: string) {
		super(
			`Obsidian CLI binary "${binary}" was not found on your PATH. Install and register the Obsidian CLI: ${OBSIDIAN_CLI_DOCS_URL}`,
		)
		this.name = 'ObsidianNotFoundError'
	}
}

/**
 * Error thrown when the installed Obsidian CLI version is not compatible with
 * the version range required by this library.
 */
export class ObsidianVersionError extends Error {
	readonly cliVersion: string
	readonly requiredRange: string

	constructor(cliVersion: string, requiredRange: string) {
		super(
			`Obsidian CLI version ${cliVersion} is not compatible with required range ${requiredRange}`,
		)
		this.name = 'ObsidianVersionError'
		this.cliVersion = cliVersion
		this.requiredRange = requiredRange
	}
}

let globalVault: string | undefined
let globalBinary = 'obsidian'

let compatibilityPromise: Promise<boolean> | undefined
let resolvedCliVersion: string | undefined

/**
 * Check whether the installed Obsidian CLI version is semver-compatible with
 * the version range required by this library ({@link OBSIDIAN_CLI_VERSION}).
 *
 * The result is memoized at the module level — only the first call invokes the
 * CLI `version` command; subsequent calls return the cached result.
 *
 * @returns `true` if the CLI version satisfies the required range, `false`
 *   otherwise.
 * @throws {ObsidianNotFoundError} If the Obsidian CLI binary is not on PATH.
 */
export async function isCompatible(): Promise<boolean> {
	// eslint-disable-next-line ts/prefer-nullish-coalescing
	if (compatibilityPromise === undefined) {
		compatibilityPromise = checkCompatibility().catch((error: unknown) => {
			// Clear the cached promise so transient failures can be retried
			compatibilityPromise = undefined
			throw error
		})
	}

	return compatibilityPromise
}

async function checkCompatibility(): Promise<boolean> {
	try {
		const result = await x(globalBinary, ['version'], { throwOnError: true })
		const raw = result.stdout.trim()
		const parsed = coerce(raw)
		if (!parsed) {
			throw new Error(`Could not parse Obsidian CLI version from: ${raw}`)
		}

		resolvedCliVersion = parsed.version
		return satisfies(resolvedCliVersion, OBSIDIAN_CLI_VERSION)
	} catch (error) {
		if (isSpawnError(error)) {
			throw new ObsidianNotFoundError(globalBinary)
		}

		throw error
	}
}

/**
 * Set global defaults for vault name and binary path.
 *
 * @param options - Command options.
 * @param options.vault - Default vault name to use for all commands. Pass
 *   `null` to clear.
 * @param options.binary - Path or name of the Obsidian CLI binary (default:
 *   `"obsidian"`).
 */
// eslint-disable-next-line ts/no-restricted-types -- null is intentional for unsetting vault
export function configure(options: { binary?: string; vault?: null | string }): void {
	if (options.vault === null) {
		globalVault = undefined
	} else if (options.vault !== undefined) {
		globalVault = options.vault
	}

	if (options.binary !== undefined && options.binary !== globalBinary) {
		if (!options.binary) {
			throw new Error('binary must be a non-empty string')
		}

		globalBinary = options.binary
		compatibilityPromise = undefined
		resolvedCliVersion = undefined
	}
}

/**
 * Get the currently configured global vault name.
 */
export function getVault(): string | undefined {
	return globalVault
}

/**
 * Execute an Obsidian CLI command.
 *
 * Builds args in the CLI's `key=value` / bare-flag syntax and calls the
 * `obsidian` binary via tinyexec, returning trimmed stdout.
 *
 * @param command - The CLI command to execute (e.g. `"files"`, `"daily:read"`).
 * @param parameters - Key-value parameters appended as `key=value` args.
 * @param flags - Bare-word boolean flags (e.g. `["total", "verbose"]`).
 * @param options - Per-call options.
 * @param options.skipErrorCheck - Skip the `Error:` prefix check on stdout
 *   (used by content-returning commands).
 * @param options.vault - Override the default vault name.
 *
 * @returns Trimmed stdout from the CLI.
 * @throws {ObsidianNotFoundError} If the binary is not on PATH.
 * @throws {ObsidianVersionError} If the CLI version is not compatible.
 * @throws {ObsidianError} If the CLI returns an error.
 */
export async function exec(
	command: string,
	parameters?: Record<string, number | string>,
	flags?: string[],
	options?: { skipErrorCheck?: boolean; vault?: string },
): Promise<string> {
	const compatible = await isCompatible()
	if (!compatible) {
		throw new ObsidianVersionError(resolvedCliVersion ?? 'unknown', OBSIDIAN_CLI_VERSION)
	}

	const args: string[] = []

	const vault = options?.vault ?? globalVault
	if (vault) args.push(`vault=${vault}`)

	args.push(command)

	if (parameters) {
		if ('file' in parameters && 'path' in parameters) {
			throw new ObsidianError(
				'Options "file" and "path" are mutually exclusive — provide one or the other, not both.',
				'',
				'',
				undefined,
			)
		}

		for (const [key, value] of Object.entries(parameters)) {
			args.push(`${key}=${value}`)
		}
	}

	if (flags) {
		args.push(...flags)
	}

	log.debug(`${globalBinary} ${args.join(' ')}`)

	try {
		const result = await x(globalBinary, args, { throwOnError: true })
		const output = result.stdout.trim()

		// Instead of returning a non-zero value and logging an error to `stderr`,
		// some errors return a string-based description on `stdout` and swallow the
		// error with a `0` return value. In these cases, `obsidian-ts` fishes the
		// error message out of the string and throws.
		if (!options?.skipErrorCheck && output.startsWith('Error:')) {
			throw new ObsidianError(
				output.slice('Error:'.length).trim(),
				result.stderr,
				result.stdout,
				result.exitCode,
			)
		}

		return output
	} catch (error) {
		if (isSpawnError(error)) {
			throw new ObsidianNotFoundError(globalBinary)
		}

		if (error instanceof NonZeroExitError && error.output) {
			throw new ObsidianError(
				error.output.stderr.trim(),
				error.output.stderr,
				error.output.stdout,
				error.output.exitCode,
				{ cause: error },
			)
		}

		throw error
	}
}

function isSpawnError(error: unknown): error is NodeJS.ErrnoException {
	if (!(error instanceof Error)) return false
	if ('code' in error && error.code === 'ENOENT') return true
	// On Windows, spawn errors may surface with a different structure
	// but still contain ENOENT in the message
	if (error.message?.includes('ENOENT')) return true
	return false
}
