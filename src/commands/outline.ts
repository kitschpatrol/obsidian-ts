import { z } from 'zod'
import type { VaultFile } from '../types'
import { exec } from '../exec'
import { parseJsonWith, parseNumber } from '../parse'

const outlineHeadingSchema = z.object({
	heading: z.string(),
	level: z.coerce.number(),
	line: z.coerce.number(),
})
export type OutlineHeading = z.infer<typeof outlineHeadingSchema>

/**
 * Show headings outline for a file.
 *
 * CLI command: `outline`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns Array of heading objects with text, level, and line number.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function show(options?: VaultFile): Promise<OutlineHeading[]> {
	const parameters: Record<string, number | string> = { format: 'json' }
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const output = await exec('outline', parameters, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseJsonWith(output, z.array(outlineHeadingSchema))
}

/**
 * Return the total number of headings.
 *
 * CLI command: `outline total`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns Total number of headings.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: VaultFile): Promise<number> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	const output = await exec('outline', parameters, ['total'], options)

	return parseNumber(output)
}
