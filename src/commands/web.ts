import type { Simplify } from 'type-fest'
import type { Vault } from '../types'
import { exec } from '../exec'
import { stripPrefix } from '../parse'

export type WebOpenOptions = Simplify<Vault & { newTab?: boolean; url: string }>

/**
 * Open a URL in Obsidian's web browser view.
 *
 * CLI command: `web`
 * @param options - Command options.
 * @param options.url - URL to open.
 * @param options.newTab - Open in new tab.
 * @returns The opened URL.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function open(options: WebOpenOptions): Promise<string> {
	const parameters: Record<string, number | string> = { url: options.url }

	const flags: string[] = []
	if (options.newTab) flags.push('newtab')

	const result = await exec('web', parameters, flags.length > 0 ? flags : undefined, options)

	return stripPrefix(result)
}
