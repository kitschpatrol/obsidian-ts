import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseJsonWith, parseNumber, stripPrefix } from '../parse'

const searchContextMatchSchema = z.object({
	line: z.coerce.number(),
	text: z.string(),
})
export type SearchContextMatch = z.infer<typeof searchContextMatchSchema>

const searchContextResultSchema = z.object({
	file: z.string(),
	matches: z.array(searchContextMatchSchema),
})
export type SearchContextResult = z.infer<typeof searchContextResultSchema>

export type SearchQueryOptions = Simplify<
	Vault & {
		case?: boolean
		limit?: number
		path?: string
		query: string
	}
>

export type SearchTotalOptions = Simplify<Vault & { case?: boolean; path?: string; query: string }>

export type SearchContextOptions = Simplify<
	Vault & {
		case?: boolean
		limit?: number
		path?: string
		query: string
	}
>

export type SearchOpenOptions = Simplify<Vault & { query?: string }>

/**
 * Search the vault for text.
 *
 * CLI command: `search`
 * @param options - Command options.
 * @param options.query - Search query (supports tag and property syntax).
 * @param options.path - Limit search to a folder.
 * @param options.limit - Maximum number of results.
 * @param options.case - Case-sensitive search.
 * @returns List of matching file paths.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function query(options: SearchQueryOptions): Promise<string[]> {
	const parameters: Record<string, number | string> = { query: options.query }
	if (options.path) parameters.path = options.path
	if (options.limit !== undefined) parameters.limit = options.limit

	const flags: string[] = []
	if (options.case) flags.push('case')

	parameters.format = 'json'
	const output = await exec('search', parameters, flags.length > 0 ? flags : undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseJsonWith(output, z.array(z.string()))
}

/**
 * Return the total number of search matches.
 *
 * CLI command: `search total`
 * @param options - Command options.
 * @param options.query - Search query.
 * @param options.path - Limit search to a folder.
 * @param options.case - Case-sensitive search.
 * @returns Total number of search matches.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options: SearchTotalOptions): Promise<number> {
	const parameters: Record<string, number | string> = { query: options.query }
	if (options.path) parameters.path = options.path

	const flags: string[] = ['total']
	if (options.case) flags.push('case')

	const output = await exec('search', parameters, flags, options)

	return parseNumber(output)
}

/**
 * Search with matching line context.
 *
 * CLI command: `search:context`
 * @param options - Command options.
 * @param options.query - Search query.
 * @param options.path - Limit search to a folder.
 * @param options.limit - Maximum number of results.
 * @param options.case - Case-sensitive search.
 * @returns Array of results with file paths and matching lines.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function context(options: SearchContextOptions): Promise<SearchContextResult[]> {
	const parameters: Record<string, number | string> = { format: 'json', query: options.query }
	if (options.path) parameters.path = options.path
	if (options.limit !== undefined) parameters.limit = options.limit

	const flags: string[] = []
	if (options.case) flags.push('case')

	const result = await exec(
		'search:context',
		parameters,
		flags.length > 0 ? flags : undefined,
		options,
	)

	if (result.startsWith('No ')) {
		return []
	}

	return parseJsonWith(result, z.array(searchContextResultSchema))
}

/**
 * Open the search view in Obsidian with an optional initial query.
 *
 * CLI command: `search:open`
 * @param options - Command options.
 * @param options.query - Initial search query.
 * @returns The search query that was opened.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function open(options?: SearchOpenOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.query) parameters.query = options.query
	const result = await exec('search:open', parameters, undefined, options)

	return stripPrefix(result)
}
