import type { Simplify } from 'type-fest'
import type { Vault } from '../types'
import { exec } from '../exec'
import { stripPrefix } from '../parse'

export type RandomOpenOptions = Simplify<Vault & { folder?: string; newTab?: boolean }>

export type RandomReadOptions = Simplify<Vault & { folder?: string }>

/**
 * Open a random note in Obsidian.
 *
 * CLI command: `random`
 * @param options - Command options.
 * @param options.folder - Limit to a specific folder.
 * @param options.newTab - Open in a new tab.
 * @returns The opened random note path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function open(options?: RandomOpenOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.folder) parameters.folder = options.folder

	const flags: string[] = []
	if (options?.newTab) flags.push('newtab')

	const result = await exec('random', parameters, flags.length > 0 ? flags : undefined, options)

	return stripPrefix(result)
}

/**
 * Read a random note's contents.
 *
 * CLI command: `random:read`
 * @param options - Command options.
 * @param options.folder - Limit to a specific folder.
 * @returns Random note contents.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function read(options?: RandomReadOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.folder) parameters.folder = options.folder
	const output = await exec('random:read', parameters, undefined, {
		...options,
		skipErrorCheck: true,
	})

	return output
}
