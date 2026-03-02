import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseKeyValueWith, parseLines, parseNumber, stripPrefix } from '../parse'

const vaultInfoSchema = z.object({
	files: z.coerce.number(),
	folders: z.coerce.number(),
	name: z.string(),
	path: z.string(),
	size: z.coerce.number(),
})
export type VaultInfo = z.infer<typeof vaultInfoSchema>

const vaultListItemSchema = z.object({
	name: z.string(),
	path: z.string(),
})
export type VaultListItem = z.infer<typeof vaultListItemSchema>

export type VaultInfoOptions = Simplify<
	Vault & { info?: 'files' | 'folders' | 'name' | 'path' | 'size' }
>

export type VaultOpenOptions = Simplify<Vault & { name: string }>

/**
 * Show vault info (name, path, file/folder count, size).
 *
 * CLI command: `vault`
 * @param options - Command options.
 * @param options.info - Return specific info only: `name`, `path`, `files`, `folders`, or `size`.
 * @returns Vault metadata as key-value pairs.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function info(options?: VaultInfoOptions): Promise<VaultInfo> {
	const parameters: Record<string, number | string> = {}
	if (options?.info) parameters.info = options.info
	const output = await exec('vault', parameters, undefined, options)

	return parseKeyValueWith(output, vaultInfoSchema)
}

/**
 * List known vaults.
 *
 * CLI command: `vaults`
 * @returns List of vault names.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(): Promise<string[]> {
	const output = await exec('vaults')

	return parseLines(output)
}

/**
 * List known vaults with verbose details (names and paths).
 *
 * CLI command: `vaults verbose`
 * @returns Array of vault objects with name and path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function listVerbose(): Promise<VaultListItem[]> {
	const output = await exec('vaults', undefined, ['verbose'])

	const items = output
		.split('\n')
		.filter((line) => line.includes('\t'))
		.map((line) => {
			const [name, path] = line.split('\t', 2)
			return { name: name.trim(), path: path.trim() }
		})

	return z.array(vaultListItemSchema).parse(items)
}

/**
 * Return the total number of known vaults.
 *
 * CLI command: `vaults total`
 * @returns Total number of vaults.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(): Promise<number> {
	const output = await exec('vaults', undefined, ['total'])

	return parseNumber(output)
}

/**
 * Open a vault by name.
 *
 * CLI command: `vault:open`
 * @param options - Command options.
 * @param options.name - Vault name to open.
 * @returns The opened vault name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function open(options: VaultOpenOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	const result = await exec('vault:open', parameters, undefined, options)

	return stripPrefix(result)
}
