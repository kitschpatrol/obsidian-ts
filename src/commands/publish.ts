import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { FileOrPath, Vault, VaultFile } from '../types'
import { exec } from '../exec'
import { parseKeyValueWith, parseLines, parseNumber, stripPrefix } from '../parse'

const publishSiteInfoSchema = z.object({
	slug: z.string(),
	url: z.string(),
})
export type PublishSiteInfo = z.infer<typeof publishSiteInfoSchema>

export type PublishStatusOptions = Simplify<
	FileOrPath &
		Vault & {
			changed?: boolean
			deleted?: boolean
			new?: boolean
		}
>

export type PublishAddOptions = Simplify<FileOrPath & Vault & { changed?: boolean }>

/**
 * Show Obsidian Publish site info.
 *
 * CLI command: `publish:site`
 * @returns Publish site info as key-value pairs.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function site(options?: Vault): Promise<PublishSiteInfo> {
	const output = await exec('publish:site', undefined, undefined, options)

	return parseKeyValueWith(output, publishSiteInfoSchema)
}

/**
 * List published notes.
 *
 * CLI command: `publish:list`
 * @returns List of published note paths.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: Vault): Promise<string[]> {
	const output = await exec('publish:list', undefined, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of published notes.
 *
 * CLI command: `publish:list total`
 * @returns Total number of published notes.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function listTotal(options?: Vault): Promise<number> {
	const output = await exec('publish:list', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * List publish changes.
 *
 * CLI command: `publish:status`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.new - Show new files only.
 * @param options.changed - Show changed files only.
 * @param options.deleted - Show deleted files only.
 * @returns Publish status details.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function status(options?: PublishStatusOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path

	const flags: string[] = []
	if (options?.new) flags.push('new')
	if (options?.changed) flags.push('changed')
	if (options?.deleted) flags.push('deleted')

	const result = await exec(
		'publish:status',
		parameters,
		flags.length > 0 ? flags : undefined,
		options,
	)

	return result
}

/**
 * Return the total number of publish status entries.
 *
 * CLI command: `publish:status total`
 * @returns Total number of publish status entries.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function statusTotal(options?: Vault): Promise<number> {
	const output = await exec('publish:status', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * Publish a file or all changed files.
 *
 * CLI command: `publish:add`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.changed - Publish all changed files.
 * @returns The published file path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function add(options?: PublishAddOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path

	const flags: string[] = []
	if (options?.changed) flags.push('changed')

	const result = await exec(
		'publish:add',
		parameters,
		flags.length > 0 ? flags : undefined,
		options,
	)

	return stripPrefix(result)
}

/**
 * Unpublish a note from Obsidian Publish.
 *
 * CLI command: `publish:remove`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns The unpublished file path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function remove(options?: VaultFile): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const result = await exec('publish:remove', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Open the published version of a note in a browser.
 *
 * CLI command: `publish:open`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns The opened published note URL.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function open(options?: VaultFile): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const result = await exec('publish:open', parameters, undefined, options)

	return stripPrefix(result)
}
