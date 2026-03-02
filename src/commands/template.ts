import type { Simplify } from 'type-fest'
import type { Vault } from '../types'
import { exec } from '../exec'
import { parseLines, parseNumber, stripPrefix } from '../parse'

export type TemplateReadOptions = Simplify<
	Vault & { name: string; resolve?: boolean; title?: string }
>

export type TemplateInsertOptions = Simplify<Vault & { name: string }>

/**
 * List available templates.
 *
 * CLI command: `templates`
 * @returns List of template names.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: Vault): Promise<string[]> {
	const output = await exec('templates', undefined, undefined, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of templates.
 *
 * CLI command: `templates total`
 * @returns Total number of templates.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: Vault): Promise<number> {
	const output = await exec('templates', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * Read template content.
 *
 * CLI command: `template:read`
 * @param options - Command options.
 * @param options.name - Template name.
 * @param options.resolve - Resolve template variables.
 * @param options.title - Title for variable resolution.
 * @returns The template contents.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function read(options: TemplateReadOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	if (options.title) parameters.title = options.title

	const flags: string[] = []
	if (options.resolve) flags.push('resolve')

	const result = await exec('template:read', parameters, flags.length > 0 ? flags : undefined, {
		...options,
		skipErrorCheck: true,
	})

	return result
}

/**
 * Insert a template into the active file.
 *
 * CLI command: `template:insert`
 * @param options - Command options.
 * @param options.name - Template name.
 * @returns The inserted template name.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function insert(options: TemplateInsertOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	const result = await exec('template:insert', parameters, undefined, options)

	return stripPrefix(result)
}
