import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { FileOrPath, Vault, VaultFile } from '../types'
import { exec } from '../exec'
import { parseKeyValueWith, parseLines, parseNumber, stripPrefix } from '../parse'

const fileInfoSchema = z.object({
	created: z.coerce.number(),
	extension: z.string(),
	modified: z.coerce.number(),
	name: z.string(),
	path: z.string(),
	size: z.coerce.number(),
})
export type FileInfo = z.infer<typeof fileInfoSchema>

export type FileListOptions = Simplify<Vault & { ext?: string; folder?: string }>

export type FileOpenOptions = Simplify<FileOrPath & Vault & { newTab?: boolean }>

export type FileCreateOptions = Simplify<
	Vault & {
		content?: string
		name?: string
		newTab?: boolean
		open?: boolean
		overwrite?: boolean
		path?: string
		template?: string
	}
>

export type FileAppendOptions = Simplify<FileOrPath & Vault & { content: string; inline?: boolean }>

export type FilePrependOptions = Simplify<
	FileOrPath & Vault & { content: string; inline?: boolean }
>

export type FileMoveOptions = Simplify<FileOrPath & Vault & { to: string }>

export type FileRenameOptions = Simplify<FileOrPath & Vault & { name: string }>

export type FileDeleteOptions = Simplify<FileOrPath & Vault & { permanent?: boolean }>

/**
 * Show file info (name, path, size, dates, etc.).
 *
 * CLI command: `file`
 * @param options - Command options.
 * @param options.file - File name (wikilink-style resolution).
 * @param options.path - Exact file path from vault root.
 * @returns File metadata as key-value pairs.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function info(options?: VaultFile): Promise<FileInfo> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const output = await exec('file', parameters, undefined, options)

	return parseKeyValueWith(output, fileInfoSchema)
}

/**
 * List files in the vault.
 *
 * CLI command: `files`
 * @param options - Command options.
 * @param options.folder - Filter by folder path.
 * @param options.ext - Filter by file extension.
 * @returns List of file paths.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: FileListOptions): Promise<string[]> {
	const parameters: Record<string, number | string> = {}
	if (options?.folder) parameters.folder = options.folder
	if (options?.ext) parameters.ext = options.ext
	const output = await exec('files', parameters, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of files in the vault.
 *
 * CLI command: `files total`
 * @returns Total number of files.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: Vault): Promise<number> {
	const output = await exec('files', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * Open a file in Obsidian.
 *
 * CLI command: `open`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.newTab - Open in a new tab.
 * @returns The opened file path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function open(options?: FileOpenOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path

	const flags: string[] = []
	if (options?.newTab) flags.push('newtab')

	const result = await exec('open', parameters, flags.length > 0 ? flags : undefined, options)

	return stripPrefix(result)
}

/**
 * Create a new file in the vault.
 *
 * CLI command: `create`
 * @param options - Command options.
 * @param options.name - File name.
 * @param options.path - File path.
 * @param options.content - Initial content.
 * @param options.template - Template name to apply.
 * @param options.overwrite - Overwrite if file already exists.
 * @param options.open - Open file after creating.
 * @param options.newTab - Open in a new tab.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function create(options?: FileCreateOptions): Promise<void> {
	const parameters: Record<string, number | string> = {}
	if (options?.name) parameters.name = options.name
	if (options?.path) parameters.path = options.path
	if (options?.content !== undefined) parameters.content = options.content
	if (options?.template) parameters.template = options.template

	const flags: string[] = []
	if (options?.overwrite) flags.push('overwrite')
	if (options?.open) flags.push('open')
	if (options?.newTab) flags.push('newtab')

	await exec('create', parameters, flags.length > 0 ? flags : undefined, options)
}

/**
 * Read file contents.
 *
 * CLI command: `read`
 * @param options - Command options.
 * @param options.file - File name (wikilink-style resolution).
 * @param options.path - Exact file path from vault root.
 * @returns The file contents.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function read(options?: VaultFile): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const result = await exec('read', parameters, undefined, { ...options, skipErrorCheck: true })

	return result
}

/**
 * Append content to the end of a file.
 *
 * CLI command: `append`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.content - Content to append (supports `\n` for newlines).
 * @param options.inline - Append without trailing newline.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function append(options: FileAppendOptions): Promise<void> {
	const parameters: Record<string, number | string> = { content: options.content }
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path

	const flags: string[] = []
	if (options.inline) flags.push('inline')

	await exec('append', parameters, flags.length > 0 ? flags : undefined, options)
}

/**
 * Prepend content to the beginning of a file.
 *
 * CLI command: `prepend`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.content - Content to prepend.
 * @param options.inline - Prepend without trailing newline.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function prepend(options: FilePrependOptions): Promise<void> {
	const parameters: Record<string, number | string> = { content: options.content }
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path

	const flags: string[] = []
	if (options.inline) flags.push('inline')

	await exec('prepend', parameters, flags.length > 0 ? flags : undefined, options)
}

/**
 * Move or rename a file, preserving links.
 *
 * CLI command: `move`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.to - Destination folder or path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function move(options: FileMoveOptions): Promise<void> {
	const parameters: Record<string, number | string> = { to: options.to }
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	await exec('move', parameters, undefined, options)
}

/**
 * Rename a file.
 *
 * CLI command: `rename`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.name - New file name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function rename(options: FileRenameOptions): Promise<void> {
	const parameters: Record<string, number | string> = { name: options.name }
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	await exec('rename', parameters, undefined, options)
}

export { deleteFile as delete }

/**
 * Delete a file (moves to trash by default).
 *
 * CLI command: `delete`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.permanent - Skip trash and delete permanently.
 * @throws {ObsidianError} if the CLI returns an error.
 */
async function deleteFile(options?: FileDeleteOptions): Promise<void> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path

	const flags: string[] = []
	if (options?.permanent) flags.push('permanent')

	await exec('delete', parameters, flags.length > 0 ? flags : undefined, options)
}
