import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseJsonWith, parseNumber } from '../parse'

const hotkeyInfoSchema = z.object({
	custom: z.string(),
	hotkey: z.string(),
	id: z.string(),
})
export type HotkeyInfo = z.infer<typeof hotkeyInfoSchema>

export type HotkeyGetOptions = Simplify<Vault & { id: string }>

/**
 * List hotkeys (includes all commands, with custom/default info).
 *
 * CLI command: `hotkeys`
 * @returns Array of hotkey objects with command and hotkey bindings.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: Vault): Promise<HotkeyInfo[]> {
	const parameters: Record<string, number | string> = { format: 'json' }
	const output = await exec('hotkeys', parameters, ['verbose', 'all'], options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseJsonWith(output, z.array(hotkeyInfoSchema))
}

/**
 * Return the total number of hotkeys.
 *
 * CLI command: `hotkeys total`
 * @returns Total number of hotkeys.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: Vault): Promise<number> {
	const output = await exec('hotkeys', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * Get the hotkey assigned to a command.
 *
 * CLI command: `hotkey`
 * @param options - Command options.
 * @param options.id - Command ID.
 * @returns The hotkey binding for the command.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function get(options: HotkeyGetOptions): Promise<string> {
	const parameters: Record<string, number | string> = { id: options.id }
	const result = await exec('hotkey', parameters, ['verbose'], options)

	return result
}
