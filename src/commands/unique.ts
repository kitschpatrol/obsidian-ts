import type { Simplify } from 'type-fest'
import type { PaneType, Vault } from '../types'
import { exec } from '../exec'

export type UniqueCreateOptions = Simplify<
	Vault & {
		content?: string
		name?: string
		open?: boolean
		paneType?: PaneType
	}
>

/**
 * Create a new note with a unique name.
 *
 * CLI command: `unique`
 * @param options - Command options.
 * @param options.name - Note name.
 * @param options.content - Initial content.
 * @param options.paneType - Pane type to open in: `tab`, `split`, or `window`.
 * @param options.open - Open file after creating.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function create(options?: UniqueCreateOptions): Promise<void> {
	const parameters: Record<string, number | string> = {}
	if (options?.name) parameters.name = options.name
	if (options?.content) parameters.content = options.content
	if (options?.paneType) parameters.paneType = options.paneType

	const flags: string[] = []
	if (options?.open) flags.push('open')

	await exec('unique', parameters, flags.length > 0 ? flags : undefined, options)
}
