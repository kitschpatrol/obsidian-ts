import { z } from 'zod'
import type { Vault, VaultFile } from '../types'
import { exec } from '../exec'
import { parseJsonWith, parseLines, parseNumber } from '../parse'

const backlinkInfoSchema = z.object({
	count: z.coerce.number(),
	file: z.string(),
})
export type BacklinkInfo = z.infer<typeof backlinkInfoSchema>

const unresolvedLinkInfoSchema = z.object({
	count: z.coerce.number(),
	link: z.string(),
})
export type UnresolvedLinkInfo = z.infer<typeof unresolvedLinkInfoSchema>

/**
 * List backlinks to a file (notes linking to the target).
 *
 * CLI command: `backlinks`
 * @param options - Command options.
 * @param options.file - Target file name.
 * @param options.path - Target file path.
 * @returns Array of backlink objects with file paths.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function backlinks(options?: VaultFile): Promise<BacklinkInfo[]> {
	const parameters: Record<string, number | string> = { format: 'json' }
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path

	const output = await exec('backlinks', parameters, ['counts'], options)

	if (output.startsWith('No backlinks')) {
		return []
	}

	return parseJsonWith(output, z.array(backlinkInfoSchema))
}

/**
 * Return the total number of backlinks to a file.
 *
 * CLI command: `backlinks total`
 * @param options - Command options.
 * @param options.file - Target file name.
 * @param options.path - Target file path.
 * @returns Total number of backlinks.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function backlinkTotal(options?: VaultFile): Promise<number> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const output = await exec('backlinks', parameters, ['total'], options)

	if (output.startsWith('No backlinks')) {
		return 0
	}

	return parseNumber(output)
}

/**
 * List outgoing links from a file.
 *
 * CLI command: `links`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns List of outgoing link targets.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function outgoing(options?: VaultFile): Promise<string[]> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const output = await exec('links', parameters, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of outgoing links from a file.
 *
 * CLI command: `links total`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns Total number of outgoing links.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function outgoingTotal(options?: VaultFile): Promise<number> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const output = await exec('links', parameters, ['total'], options)

	if (output.startsWith('No ')) {
		return 0
	}

	return parseNumber(output)
}

/**
 * List unresolved (broken) links in the vault.
 *
 * CLI command: `unresolved`
 * @param options - Command options.
 * @returns List of unresolved link targets.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function unresolved(options?: Vault): Promise<UnresolvedLinkInfo[]> {
	const parameters: Record<string, number | string> = { format: 'json' }

	const output = await exec('unresolved', parameters, ['verbose', 'counts'], options)

	if (output.startsWith('No unresolved')) {
		return []
	}

	return parseJsonWith(output, z.array(unresolvedLinkInfoSchema))
}

/**
 * Return the total number of unresolved links.
 *
 * CLI command: `unresolved total`
 * @returns Total number of unresolved links.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function unresolvedTotal(options?: Vault): Promise<number> {
	const output = await exec('unresolved', undefined, ['total'], options)

	if (output.startsWith('No unresolved')) {
		return 0
	}

	return parseNumber(output)
}

/**
 * List files with no incoming links (orphans).
 *
 * CLI command: `orphans`
 * @param options - Command options.
 * @returns List of orphan file paths.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function orphans(options?: Vault): Promise<string[]> {
	const output = await exec('orphans', undefined, ['all'], options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of orphan files.
 *
 * CLI command: `orphans total`
 * @returns Total number of orphan files.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function orphanTotal(options?: Vault): Promise<number> {
	const output = await exec('orphans', undefined, ['total'], options)

	if (output.startsWith('No ')) {
		return 0
	}

	return parseNumber(output)
}

/**
 * List files with no outgoing links (dead ends).
 *
 * CLI command: `deadends`
 * @param options - Command options.
 * @returns List of dead-end file paths.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function deadEnds(options?: Vault): Promise<string[]> {
	const output = await exec('deadends', undefined, ['all'], options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of dead-end files.
 *
 * CLI command: `deadends total`
 * @returns Total number of dead-end files.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function deadEndTotal(options?: Vault): Promise<number> {
	const output = await exec('deadends', undefined, ['total'], options)

	if (output.startsWith('No ')) {
		return 0
	}

	return parseNumber(output)
}
