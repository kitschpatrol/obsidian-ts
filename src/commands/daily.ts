import type { Simplify } from 'type-fest'
import type { PaneType, Vault } from '../types'
import { exec } from '../exec'
import { stripPrefix } from '../parse'

export type DailyOpenOptions = Simplify<Vault & { paneType?: PaneType }>

export type DailyAppendOptions = Simplify<
	Vault & {
		content: string
		inline?: boolean
		open?: boolean
		paneType?: PaneType
	}
>

export type DailyPrependOptions = Simplify<
	Vault & {
		content: string
		inline?: boolean
		open?: boolean
		paneType?: PaneType
	}
>

/**
 * Open today's daily note in Obsidian.
 *
 * CLI command: `daily`
 * @param options - Command options.
 * @param options.paneType - Pane type to open in: `tab`, `split`, or `window`.
 * @returns The opened daily note path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function open(options?: DailyOpenOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.paneType) parameters.paneType = options.paneType
	const result = await exec('daily', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Get the file path of today's daily note.
 *
 * CLI command: `daily:path`
 * @returns The file path of today's daily note.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function path(options?: Vault): Promise<string> {
	const result = await exec('daily:path', undefined, undefined, options)

	return result
}

/**
 * Read today's daily note contents.
 *
 * CLI command: `daily:read`
 * @returns The contents of today's daily note.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function read(options?: Vault): Promise<string> {
	const result = await exec('daily:read', undefined, undefined, {
		...options,
		skipErrorCheck: true,
	})

	return result
}

/**
 * Append content to today's daily note.
 *
 * CLI command: `daily:append`
 * @param options - Command options.
 * @param options.content - Content to append.
 * @param options.inline - Append without trailing newline.
 * @param options.open - Open file after adding.
 * @param options.paneType - Pane type to open in: `tab`, `split`, or `window`.
 * @returns The daily note path content was added to.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function append(options: DailyAppendOptions): Promise<string> {
	const parameters: Record<string, number | string> = { content: options.content }
	if (options.paneType) parameters.paneType = options.paneType

	const flags: string[] = []
	if (options.inline) flags.push('inline')
	if (options.open) flags.push('open')

	const result = await exec(
		'daily:append',
		parameters,
		flags.length > 0 ? flags : undefined,
		options,
	)

	return stripPrefix(result)
}

/**
 * Prepend content to today's daily note.
 *
 * CLI command: `daily:prepend`
 * @param options - Command options.
 * @param options.content - Content to prepend.
 * @param options.inline - Prepend without trailing newline.
 * @param options.open - Open file after adding.
 * @param options.paneType - Pane type to open in: `tab`, `split`, or `window`.
 * @returns The daily note path content was added to.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function prepend(options: DailyPrependOptions): Promise<string> {
	const parameters: Record<string, number | string> = { content: options.content }
	if (options.paneType) parameters.paneType = options.paneType

	const flags: string[] = []
	if (options.inline) flags.push('inline')
	if (options.open) flags.push('open')

	const result = await exec(
		'daily:prepend',
		parameters,
		flags.length > 0 ? flags : undefined,
		options,
	)

	return stripPrefix(result)
}
