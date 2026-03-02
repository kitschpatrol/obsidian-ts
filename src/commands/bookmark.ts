import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseJsonWith, parseNumber, stripPrefix } from '../parse'

const bookmarkInfoSchema = z.object({
	title: z.string(),
	type: z.string(),
	value: z.string(),
})
export type BookmarkInfo = z.infer<typeof bookmarkInfoSchema>

export type BookmarkAddOptions = Simplify<
	Vault & {
		file?: string
		folder?: string
		search?: string
		subpath?: string
		title?: string
		url?: string
	}
>

/**
 * List bookmarks in the vault.
 *
 * CLI command: `bookmarks`
 * @returns Array of bookmark objects with title, path, and type.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: Vault): Promise<BookmarkInfo[]> {
	const parameters: Record<string, number | string> = { format: 'json' }
	const output = await exec('bookmarks', parameters, ['verbose'], options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseJsonWith(output, z.array(bookmarkInfoSchema))
}

/**
 * Return the total number of bookmarks.
 *
 * CLI command: `bookmarks total`
 * @returns Total number of bookmarks.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: Vault): Promise<number> {
	const output = await exec('bookmarks', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * Add a bookmark.
 *
 * CLI command: `bookmark`
 * @param options - Command options.
 * @param options.file - File to bookmark.
 * @param options.subpath - Subpath (heading or block) within file.
 * @param options.folder - Folder to bookmark.
 * @param options.search - Search query to bookmark.
 * @param options.url - URL to bookmark.
 * @param options.title - Bookmark title.
 * @returns The bookmarked item identifier.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function add(options: BookmarkAddOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options.file) parameters.file = options.file
	if (options.subpath) parameters.subpath = options.subpath
	if (options.folder) parameters.folder = options.folder
	if (options.search) parameters.search = options.search
	if (options.url) parameters.url = options.url
	if (options.title) parameters.title = options.title
	const result = await exec('bookmark', parameters, undefined, options)

	return stripPrefix(result)
}
