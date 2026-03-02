import type { Simplify } from 'type-fest'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseLines, stripPrefix } from '../parse'

export type CommandListOptions = Simplify<Vault & { filter?: string }>

export type CommandExecuteOptions = Simplify<Vault & { id: string }>

/**
 * List available command IDs.
 *
 * CLI command: `commands`
 * @param options - Command options.
 * @param options.filter - Filter by ID prefix.
 * @returns List of command IDs.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: CommandListOptions): Promise<string[]> {
	const parameters: Record<string, number | string> = {}
	if (options?.filter) parameters.filter = options.filter
	const output = await exec('commands', parameters, undefined, options)

	return parseLines(output)
}

/**
 * Execute an Obsidian command by ID.
 *
 * CLI command: `command`
 * @param options - Command options.
 * @param options.id - Command ID to execute.
 * @returns The executed command ID.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function execute(options: CommandExecuteOptions): Promise<string> {
	const parameters: Record<string, number | string> = { id: options.id }
	const result = await exec('command', parameters, undefined, options)

	return stripPrefix(result)
}
