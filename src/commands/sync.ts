import type { Simplify } from 'type-fest'
import type { FileOrPath, Vault, VaultFile } from '../types'
import { exec } from '../exec'
import { parseLines, parseNumber, stripPrefix } from '../parse'

export type SyncToggleOptions = Simplify<Vault & { enable: boolean }>

export type SyncReadOptions = Simplify<FileOrPath & Vault & { version: number }>

export type SyncRestoreOptions = Simplify<FileOrPath & Vault & { version: number }>

/**
 * Pause or resume Obsidian Sync.
 *
 * CLI command: `sync on|off`
 * @param options - Command options.
 * @param options.enable - `true` to resume sync, `false` to pause.
 * @returns Sync status message.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function toggle(options: SyncToggleOptions): Promise<string> {
	const result = await exec('sync', undefined, [options.enable ? 'on' : 'off'], options)

	return result
}

/**
 * Show Obsidian Sync status.
 *
 * CLI command: `sync:status`
 * @returns Sync status details.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function status(options?: Vault): Promise<string> {
	const result = await exec('sync:status', undefined, undefined, options)

	return result
}

/**
 * List sync version history for a file.
 *
 * CLI command: `sync:history`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns Sync version history for the file.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function history(options?: VaultFile): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const result = await exec('sync:history', parameters, undefined, options)

	return result
}

/**
 * Return the total number of sync versions for a file.
 *
 * CLI command: `sync:history total`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns Total number of sync versions.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function historyTotal(options?: VaultFile): Promise<number> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const output = await exec('sync:history', parameters, ['total'], options)

	return parseNumber(output)
}

/**
 * Read a specific sync version of a file.
 *
 * CLI command: `sync:read`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.version - Version number.
 * @returns The file contents at the specified sync version.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function read(options: SyncReadOptions): Promise<string> {
	const parameters: Record<string, number | string> = { version: options.version }
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	const result = await exec('sync:read', parameters, undefined, {
		...options,
		skipErrorCheck: true,
	})

	return result
}

/**
 * Restore a file to a specific sync version.
 *
 * CLI command: `sync:restore`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.version - Version number to restore.
 * @returns The restored file path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function restore(options: SyncRestoreOptions): Promise<string> {
	const parameters: Record<string, number | string> = { version: options.version }
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	const result = await exec('sync:restore', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Open sync history view.
 *
 * CLI command: `sync:open`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns The file path for which sync history was opened.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function open(options?: VaultFile): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const result = await exec('sync:open', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * List deleted files tracked by Obsidian Sync.
 *
 * CLI command: `sync:deleted`
 * @returns List of deleted file paths tracked by sync.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function deleted(options?: Vault): Promise<string[]> {
	const output = await exec('sync:deleted', undefined, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of deleted files in sync.
 *
 * CLI command: `sync:deleted total`
 * @returns Total number of deleted files in sync.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function deletedTotal(options?: Vault): Promise<number> {
	const output = await exec('sync:deleted', undefined, ['total'], options)

	return parseNumber(output)
}
