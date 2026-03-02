import { z } from 'zod'
import type { Vault } from '../types'
import { exec, ObsidianError } from '../exec'

const versionInfoSchema = z.object({
	installer: z.string(),
	version: z.string(),
})
export type VersionInfo = z.infer<typeof versionInfoSchema>

/**
 * Show the Obsidian version.
 *
 * CLI command: `version`
 * @returns The Obsidian version and installer version.
 * @throws {Error} if the version string cannot be parsed.
 */
export async function version(): Promise<VersionInfo> {
	const result = await exec('version')

	const match = /^([\d.]+)\s+\(installer\s+([\d.]+)\)$/.exec(result)
	if (!match) throw new ObsidianError(`Invalid version string: ${result}`, '', result, undefined)
	return versionInfoSchema.parse({ installer: match[2], version: match[1] })
}

/**
 * Reload the vault.
 *
 * Takes vault even though undocumented.
 *
 * CLI command: `reload`
 */
export async function reload(options?: Vault): Promise<void> {
	await exec('reload', undefined, undefined, options)
}

/**
 * Restart the Obsidian app.
 *
 * CLI command: `restart`
 */
export async function restart(): Promise<void> {
	await exec('restart')
}
