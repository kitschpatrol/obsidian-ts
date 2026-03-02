import type { Simplify } from 'type-fest'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseLines, parseNumber, stripPrefix } from '../parse'

export type WorkspaceSaveOptions = Simplify<Vault & { name?: string }>

export type WorkspaceLoadOptions = Simplify<Vault & { name: string }>

export type WorkspaceDeleteOptions = Simplify<Vault & { name: string }>

export type WorkspaceOpenTabOptions = Simplify<
	Vault & { file?: string; group?: string; view?: string }
>

/**
 * Show the current workspace tree (with IDs).
 *
 * CLI command: `workspace`
 * @returns Workspace tree with IDs.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function show(options?: Vault): Promise<string> {
	const result = await exec('workspace', undefined, ['ids'], options)

	return result
}

/**
 * List saved workspaces.
 *
 * CLI command: `workspaces`
 * @returns List of saved workspace names.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: Vault): Promise<string[]> {
	const output = await exec('workspaces', undefined, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of saved workspaces.
 *
 * CLI command: `workspaces total`
 * @returns Total number of saved workspaces.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: Vault): Promise<number> {
	const output = await exec('workspaces', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * Save the current workspace.
 *
 * CLI command: `workspace:save`
 * @param options - Command options.
 * @param options.name - Workspace name.
 * @returns The saved workspace name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function save(options?: WorkspaceSaveOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.name) parameters.name = options.name
	const result = await exec('workspace:save', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Load a saved workspace.
 *
 * CLI command: `workspace:load`
 * @param options - Command options.
 * @param options.name - Workspace name.
 * @returns The loaded workspace name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function load(options: WorkspaceLoadOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	const result = await exec('workspace:load', parameters, undefined, options)

	return stripPrefix(result)
}

export { deleteWorkspace as delete }

/**
 * Delete a saved workspace.
 *
 * CLI command: `workspace:delete`
 * @param options - Command options.
 * @param options.name - Workspace name.
 * @returns The deleted workspace name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
async function deleteWorkspace(options: WorkspaceDeleteOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	const result = await exec('workspace:delete', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * List open tabs (with IDs).
 *
 * CLI command: `tabs`
 * @returns List of open tab descriptions with IDs.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function tabs(options?: Vault): Promise<string[]> {
	const output = await exec('tabs', undefined, ['ids'], options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Open a new tab.
 *
 * CLI command: `tab:open`
 * @param options - Command options.
 * @param options.group - Tab group ID.
 * @param options.file - File to open.
 * @param options.view - View type to open.
 * @returns The opened tab identifier.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function openTab(options?: WorkspaceOpenTabOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.group) parameters.group = options.group
	if (options?.file) parameters.file = options.file
	if (options?.view) parameters.view = options.view
	const result = await exec('tab:open', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * List recently opened files.
 *
 * CLI command: `recents`
 * @returns List of recently opened file paths.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function recents(options?: Vault): Promise<string[]> {
	const output = await exec('recents', undefined, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of recently opened files.
 *
 * CLI command: `recents total`
 * @returns Total number of recently opened files.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function recentTotal(options?: Vault): Promise<number> {
	const output = await exec('recents', undefined, ['total'], options)

	return parseNumber(output)
}
