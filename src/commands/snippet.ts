import type { Simplify } from 'type-fest'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseLines, stripPrefix } from '../parse'

export type SnippetEnableOptions = Simplify<Vault & { name: string }>

export type SnippetDisableOptions = Simplify<Vault & { name: string }>

/**
 * List installed CSS snippets.
 *
 * CLI command: `snippets`
 * @returns List of installed snippet names.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: Vault): Promise<string[]> {
	const output = await exec('snippets', undefined, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * List enabled CSS snippets.
 *
 * CLI command: `snippets:enabled`
 * @returns List of enabled snippet names.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function enabled(options?: Vault): Promise<string[]> {
	const output = await exec('snippets:enabled', undefined, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Enable a CSS snippet.
 *
 * CLI command: `snippet:enable`
 * @param options - Command options.
 * @param options.name - Snippet name.
 * @returns The enabled snippet name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function enable(options: SnippetEnableOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	const result = await exec('snippet:enable', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Disable a CSS snippet.
 *
 * CLI command: `snippet:disable`
 * @param options - Command options.
 * @param options.name - Snippet name.
 * @returns The disabled snippet name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function disable(options: SnippetDisableOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	const result = await exec('snippet:disable', parameters, undefined, options)

	return stripPrefix(result)
}
