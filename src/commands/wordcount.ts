import { z } from 'zod'
import type { VaultFile } from '../types'
import { exec } from '../exec'
import { parseKeyValueWith } from '../parse'

const wordCountInfoSchema = z.object({
	characters: z.coerce.number(),
	words: z.coerce.number(),
})
export type WordCountInfo = z.infer<typeof wordCountInfoSchema>

/**
 * Count words and characters for a file.
 *
 * CLI command: `wordcount`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns Word and character counts.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function get(options?: VaultFile): Promise<WordCountInfo> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path

	const output = await exec('wordcount', parameters, undefined, options)

	return parseKeyValueWith(output, wordCountInfoSchema)
}
