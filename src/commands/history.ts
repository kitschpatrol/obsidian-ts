import type { Simplify } from 'type-fest'
import type { FileOrPath, Vault, VaultFile } from '../types'
import { exec } from '../exec'
import { parseLines, stripPrefix } from '../parse'

export type HistoryReadOptions = Simplify<FileOrPath & Vault & { version?: number }>

export type HistoryRestoreOptions = Simplify<FileOrPath & Vault & { version: number }>

/**
 * List file history versions.
 *
 * CLI command: `history`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns File history version listing.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function show(options?: VaultFile): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const result = await exec('history', parameters, undefined, {
		...options,
		skipErrorCheck: true,
	})

	return result
}

/**
 * List files that have history versions.
 *
 * CLI command: `history:list`
 * @returns List of files that have history versions.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: Vault): Promise<string[]> {
	const output = await exec('history:list', undefined, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Read a specific file history version.
 *
 * CLI command: `history:read`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.version - Version number (default: 1).
 * @returns The file contents at the specified version.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function read(options?: HistoryReadOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	if (options?.version !== undefined) parameters.version = options.version
	const result = await exec('history:read', parameters, undefined, {
		...options,
		skipErrorCheck: true,
	})

	return result
}

/**
 * Restore a file to a specific history version.
 *
 * CLI command: `history:restore`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.version - Version number to restore.
 * @returns The restored file path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function restore(options: HistoryRestoreOptions): Promise<string> {
	const parameters: Record<string, number | string> = { version: options.version }
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	const result = await exec('history:restore', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Open file recovery view.
 *
 * CLI command: `history:open`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns The file path for which history was opened.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function open(options?: VaultFile): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const result = await exec('history:open', parameters, undefined, options)

	return stripPrefix(result)
}
