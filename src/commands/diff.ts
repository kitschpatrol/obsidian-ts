import type { Simplify } from 'type-fest'
import type { FileOrPath, Vault } from '../types'
import { exec } from '../exec'

export type DiffOptions = Simplify<
	FileOrPath &
		Vault & {
			filter?: 'local' | 'sync'
			from?: number
			to?: number
		}
>

/**
 * List or diff local/sync file versions.
 *
 * CLI command: `diff`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.from - Version number to diff from.
 * @param options.to - Version number to diff to.
 * @param options.filter - Filter by version source: `local` or `sync`.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function diff(options?: DiffOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	if (options?.from !== undefined) parameters.from = options.from
	if (options?.to !== undefined) parameters.to = options.to
	if (options?.filter) parameters.filter = options.filter
	const result = await exec('diff', parameters, undefined, { ...options, skipErrorCheck: true })

	return result
}
