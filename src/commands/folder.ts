import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseKeyValueWith, parseLines, parseNumber } from '../parse'

const folderInfoSchema = z.object({
	files: z.coerce.number().optional(),
	folders: z.coerce.number().optional(),
	path: z.string().optional(),
	size: z.coerce.number().optional(),
})
export type FolderInfo = z.infer<typeof folderInfoSchema>

export type FolderInfoOptions = Simplify<
	Vault & { info?: 'files' | 'folders' | 'size'; path: string }
>

export type FolderListOptions = Simplify<Vault & { folder?: string }>

/**
 * Show folder info.
 *
 * CLI command: `folder`
 * @param options - Command options.
 * @param options.path - Folder path.
 * @param options.info - Return specific info only: `files`, `folders`, or `size`.
 * @returns Folder metadata as key-value pairs.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function info(options: FolderInfoOptions): Promise<FolderInfo> {
	const parameters: Record<string, number | string> = { path: options.path }
	if (options.info) parameters.info = options.info
	const output = await exec('folder', parameters, undefined, options)

	return parseKeyValueWith(output, folderInfoSchema)
}

/**
 * List folders in the vault.
 *
 * CLI command: `folders`
 * @param options - Command options.
 * @param options.folder - Filter by parent folder.
 * @returns List of folder paths.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: FolderListOptions): Promise<string[]> {
	const parameters: Record<string, number | string> = {}
	if (options?.folder) parameters.folder = options.folder
	const output = await exec('folders', parameters, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of folders in the vault.
 *
 * CLI command: `folders total`
 * @returns Total number of folders.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: Vault): Promise<number> {
	const output = await exec('folders', undefined, ['total'], options)

	return parseNumber(output)
}
