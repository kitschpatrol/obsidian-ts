import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { FileOrPath, Vault } from '../types'
import { exec } from '../exec'
import { parseJsonWith, parseNumber } from '../parse'

const tagInfoSchema = z.object({
	count: z.coerce.number().optional(),
	tag: z.string(),
})
export type TagInfo = z.infer<typeof tagInfoSchema>

export type TagListOptions = Simplify<
	FileOrPath &
		Vault & {
			active?: boolean
			sort?: 'count'
		}
>

export type TagInfoOptions = Simplify<Vault & { name: string; total?: boolean }>

/**
 * List tags in the vault or for a specific file.
 *
 * CLI command: `tags`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.sort - Sort by `count` (default: name).
 * @param options.active - Show tags for the active file.
 * @returns Array of tag objects with tag name and optional count.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: TagListOptions): Promise<TagInfo[]> {
	const parameters: Record<string, number | string> = { format: 'json' }
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	if (options?.sort) parameters.sort = options.sort

	const flags: string[] = ['counts']
	if (options?.active) flags.push('active')

	const output = await exec('tags', parameters, flags, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseJsonWith(output, z.array(tagInfoSchema))
}

/**
 * Return the total number of tags.
 *
 * CLI command: `tags total`
 * @returns Total number of tags.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: Vault): Promise<number> {
	const output = await exec('tags', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * Get tag info (occurrences, files, etc.).
 *
 * CLI command: `tag`
 * @param options - Command options.
 * @param options.name - Tag name (without `#`).
 * @param options.total - Return occurrence count.
 * @returns Tag info with occurrence details.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function info(options: TagInfoOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }

	const flags: string[] = ['verbose']
	if (options.total) flags.push('total')

	const result = await exec('tag', parameters, flags, options)

	return result
}
