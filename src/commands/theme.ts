import type { Simplify } from 'type-fest'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseLines, stripPrefix } from '../parse'

export type ThemeInfoOptions = Simplify<Vault & { name?: string }>

export type ThemeSetOptions = Simplify<Vault & { name: string }>

export type ThemeInstallOptions = Simplify<Vault & { enable?: boolean; name: string }>

export type ThemeUninstallOptions = Simplify<Vault & { name: string }>

/**
 * List installed themes (with versions).
 *
 * CLI command: `themes`
 * @returns List of installed theme names with versions.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: Vault): Promise<string[]> {
	const output = await exec('themes', undefined, ['versions'], options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Show active theme or get theme info by name.
 *
 * CLI command: `theme`
 * @param options - Command options.
 * @param options.name - Theme name for details.
 * @returns Theme info text.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function info(options?: ThemeInfoOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.name) parameters.name = options.name
	const result = await exec('theme', parameters, undefined, options)

	return result
}

/**
 * Set the active theme.
 *
 * CLI command: `theme:set`
 * @param options - Command options.
 * @param options.name - Theme name (empty string for default theme).
 * @returns The active theme name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function set(options: ThemeSetOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	const result = await exec('theme:set', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Install a community theme.
 *
 * CLI command: `theme:install`
 * @param options - Command options.
 * @param options.name - Theme name.
 * @param options.enable - Activate the theme after installation.
 * @returns The installed theme name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function install(options: ThemeInstallOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }

	const flags: string[] = []
	if (options.enable) flags.push('enable')

	const result = await exec(
		'theme:install',
		parameters,
		flags.length > 0 ? flags : undefined,
		options,
	)

	return stripPrefix(result)
}

/**
 * Uninstall a theme.
 *
 * CLI command: `theme:uninstall`
 * @param options - Command options.
 * @param options.name - Theme name.
 * @returns The uninstalled theme name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function uninstall(options: ThemeUninstallOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	const result = await exec('theme:uninstall', parameters, undefined, options)

	return stripPrefix(result)
}
