import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseJsonWith, stripPrefix } from '../parse'

export type PluginFilter = 'community' | 'core'

const pluginInfoSchema = z.object({
	id: z.string(),
	version: z.string().optional(),
})
export type PluginInfo = z.infer<typeof pluginInfoSchema>

export type PluginListOptions = Simplify<Vault & { filter?: PluginFilter }>

export type PluginEnabledOptions = Simplify<Vault & { filter?: PluginFilter }>

export type PluginInfoOptions = Simplify<Vault & { id: string }>

export type PluginEnableOptions = Simplify<Vault & { filter?: PluginFilter; id: string }>

export type PluginDisableOptions = Simplify<Vault & { filter?: PluginFilter; id: string }>

export type PluginInstallOptions = Simplify<Vault & { enable?: boolean; id: string }>

export type PluginUninstallOptions = Simplify<Vault & { id: string }>

export type PluginReloadOptions = Simplify<Vault & { id: string }>

/**
 * List installed plugins (with versions).
 *
 * CLI command: `plugins`
 * @param options - Command options.
 * @param options.filter - Filter by plugin type: `core` or `community`.
 * @returns Array of plugin objects with ID and version.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: PluginListOptions): Promise<PluginInfo[]> {
	const parameters: Record<string, number | string> = { format: 'json' }
	if (options?.filter) parameters.filter = options.filter

	const output = await exec('plugins', parameters, ['versions'], options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseJsonWith(output, z.array(pluginInfoSchema))
}

/**
 * List enabled plugins (with versions).
 *
 * CLI command: `plugins:enabled`
 * @param options - Command options.
 * @param options.filter - Filter by plugin type: `core` or `community`.
 * @returns Array of enabled plugin objects with ID and version.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function enabled(options?: PluginEnabledOptions): Promise<PluginInfo[]> {
	const parameters: Record<string, number | string> = { format: 'json' }
	if (options?.filter) parameters.filter = options.filter

	const output = await exec('plugins:enabled', parameters, ['versions'], options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseJsonWith(output, z.array(pluginInfoSchema))
}

export type PluginRestrictOptions = Simplify<Vault & { enable?: boolean }>

/**
 * Toggle or check restricted mode.
 *
 * CLI command: `plugins:restrict`
 * @param options - Command options.
 * @param options.enable - `true` to enable restricted mode, `false` to disable. Omit to check current state.
 * @returns Restricted mode status message.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function restrict(options?: PluginRestrictOptions): Promise<string> {
	const flags: string[] = []
	if (options?.enable === true) flags.push('on')
	if (options?.enable === false) flags.push('off')
	const result = await exec(
		'plugins:restrict',
		undefined,
		flags.length > 0 ? flags : undefined,
		options,
	)

	return result
}

/**
 * Get plugin info by ID.
 *
 * CLI command: `plugin`
 * @param options - Command options.
 * @param options.id - Plugin ID.
 * @returns Plugin info text.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function info(options: PluginInfoOptions): Promise<string> {
	const parameters: Record<string, number | string> = { id: options.id }
	const result = await exec('plugin', parameters, undefined, options)

	return result
}

/**
 * Enable a plugin.
 *
 * CLI command: `plugin:enable`
 * @param options - Command options.
 * @param options.id - Plugin ID.
 * @param options.filter - Plugin type: `core` or `community`.
 * @returns The enabled plugin ID.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function enable(options: PluginEnableOptions): Promise<string> {
	const parameters: Record<string, number | string> = { id: options.id }
	if (options.filter) parameters.filter = options.filter
	const result = await exec('plugin:enable', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Disable a plugin.
 *
 * CLI command: `plugin:disable`
 * @param options - Command options.
 * @param options.id - Plugin ID.
 * @param options.filter - Plugin type: `core` or `community`.
 * @returns The disabled plugin ID.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function disable(options: PluginDisableOptions): Promise<string> {
	const parameters: Record<string, number | string> = { id: options.id }
	if (options.filter) parameters.filter = options.filter
	const result = await exec('plugin:disable', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Install a community plugin.
 *
 * CLI command: `plugin:install`
 * @param options - Command options.
 * @param options.id - Plugin ID.
 * @param options.enable - Enable the plugin after installation.
 * @returns The installed plugin ID.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function install(options: PluginInstallOptions): Promise<string> {
	const parameters: Record<string, number | string> = { id: options.id }

	const flags: string[] = []
	if (options.enable) flags.push('enable')

	const result = await exec(
		'plugin:install',
		parameters,
		flags.length > 0 ? flags : undefined,
		options,
	)

	return stripPrefix(result)
}

/**
 * Uninstall a community plugin.
 *
 * CLI command: `plugin:uninstall`
 * @param options - Command options.
 * @param options.id - Plugin ID.
 * @returns The uninstalled plugin ID.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function uninstall(options: PluginUninstallOptions): Promise<string> {
	const parameters: Record<string, number | string> = { id: options.id }
	const result = await exec('plugin:uninstall', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Reload a plugin (useful during development).
 *
 * CLI command: `plugin:reload`
 * @param options - Command options.
 * @param options.id - Plugin ID.
 * @returns The reloaded plugin ID.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function reload(options: PluginReloadOptions): Promise<string> {
	const parameters: Record<string, number | string> = { id: options.id }
	const result = await exec('plugin:reload', parameters, undefined, options)

	return stripPrefix(result)
}
