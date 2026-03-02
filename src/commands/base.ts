import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { FileOrPath, Vault, VaultFile } from '../types'
import { exec } from '../exec'
import { parseJsonWith, parseLines, stripPrefix } from '../parse'

export type BaseCreateOptions = Simplify<
	FileOrPath &
		Vault & {
			content?: string
			name?: string
			newTab?: boolean
			open?: boolean
			view?: string
		}
>

export type BaseQueryOptions = Simplify<
	FileOrPath &
		Vault & {
			view?: string
		}
>

const baseQueryResultSchema = z.object({
	'file name': z.string(),
	path: z.string(),
})
export type BaseQueryResult = z.infer<typeof baseQueryResultSchema>

/**
 * List all base files in the vault.
 *
 * CLI command: `bases`
 * @returns List of base file names.
 */
export async function list(options?: Vault): Promise<string[]> {
	const output = await exec('bases', undefined, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * List views in a base file.
 *
 * CLI command: `base:views`
 * @returns List of view names in the base file.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function views(options?: VaultFile): Promise<string[]> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const output = await exec('base:views', parameters, undefined, options)

	return parseLines(output)
}

/**
 * Create a new item in a base.
 *
 * CLI command: `base:create`
 * @param options - Command options.
 * @param options.file - Base file name.
 * @param options.path - Base file path.
 * @param options.view - View name.
 * @param options.name - New file name.
 * @param options.content - Initial content.
 * @param options.open - Open file after creating.
 * @param options.newTab - Open in new tab.
 * @returns Path to created file.
 * @throws {ObsidianError} if the CLI returns an error or the response cannot be parsed.
 */
export async function create(options?: BaseCreateOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	if (options?.view) parameters.view = options.view
	if (options?.name) parameters.name = options.name
	if (options?.content !== undefined) parameters.content = options.content

	const flags: string[] = []
	if (options?.open) flags.push('open')
	if (options?.newTab) flags.push('newtab')

	const result = await exec(
		'base:create',
		parameters,
		flags.length > 0 ? flags : undefined,
		options,
	)

	return stripPrefix(result)
}

/**
 * Query a base and return results.
 *
 * CLI command: `base:query`
 * @param options - Command options.
 * @param options.file - Base file name.
 * @param options.path - Base file path.
 * @param options.view - View name to query.
 * @returns Array of objects with file name and path.
 * @throws {ObsidianError} if the CLI returns an error or the response is not valid JSON.
 */
export async function query(options?: BaseQueryOptions): Promise<BaseQueryResult[]> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	if (options?.view) parameters.view = options.view
	parameters.format = 'json'
	const result = await exec('base:query', parameters, undefined, options)

	return parseJsonWith(result, z.array(baseQueryResultSchema))
}
