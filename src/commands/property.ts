import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { JsonValue } from '../parse'
import type { FileOrPath, Vault } from '../types'
import { exec } from '../exec'
import { parseJson, parseLines, parseNumber, stripPrefix } from '../parse'

// TODO unused?
const _propertyInfoSchema = z.object({
	count: z.coerce.number(),
	name: z.string(),
	type: z.string(),
})
export type PropertyInfo = z.infer<typeof _propertyInfoSchema>

export type PropertyListOptions = Simplify<
	FileOrPath &
		Vault & {
			active?: boolean
			name?: string
			sort?: 'count'
		}
>

export type PropertySetOptions = Simplify<
	FileOrPath &
		Vault & {
			name: string
			type?: 'checkbox' | 'date' | 'datetime' | 'list' | 'number' | 'text'
			value: string
		}
>

export type PropertyRemoveOptions = Simplify<FileOrPath & Vault & { name: string }>

export type PropertyReadOptions = Simplify<FileOrPath & Vault & { name: string }>

export type PropertyAliasesOptions = Simplify<FileOrPath & Vault & { active?: boolean }>

/**
 * List properties in the vault or for a specific file.
 * TODO arguments change output type!
 * propertyInfoSchema if whole vault, otherwise
 * individual property items is file
 *
 * CLI command: `properties`
 * @param options - Command options.
 * @param options.file - Show properties for file.
 * @param options.path - Show properties for path.
 * @param options.name - Get specific property count.
 * @param options.sort - Sort by `count` (default: name).
 * @param options.active - Show properties for the active file.
 * @returns Array of property objects with name, type, and count.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: PropertyListOptions): Promise<JsonValue> {
	const parameters: Record<string, number | string> = { format: 'json' }
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	if (options?.name) parameters.name = options.name
	if (options?.sort) parameters.sort = options.sort

	const flags: string[] = ['counts']
	if (options?.active) flags.push('active')

	const output = await exec('properties', parameters, flags, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseJson(output)
}

/**
 * Return the total number of properties.
 *
 * CLI command: `properties total`
 * @returns Total number of properties.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: Vault): Promise<number> {
	const output = await exec('properties', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * Set a property on a file.
 *
 * CLI command: `property:set`
 * @param options - Command options.
 * @param options.name - Property name.
 * @param options.value - Property value.
 * @param options.type - Property type: `text`, `list`, `number`, `checkbox`, `date`, or `datetime`.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns The property that was set.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function set(options: PropertySetOptions): Promise<string> {
	const parameters: Record<string, number | string> = {
		name: options.name,
		value: options.value,
	}
	if (options.type) parameters.type = options.type
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	const result = await exec('property:set', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Remove a property from a file.
 *
 * CLI command: `property:remove`
 * @param options - Command options.
 * @param options.name - Property name.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns The property that was removed.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function remove(options: PropertyRemoveOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	const result = await exec('property:remove', parameters, undefined, options)

	return stripPrefix(result)
}

/**
 * Read a property value from a file.
 *
 * CLI command: `property:read`
 * @param options - Command options.
 * @param options.name - Property name.
 * @param options.file - File name.
 * @param options.path - File path.
 * @returns The property value.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function read(options: PropertyReadOptions): Promise<string> {
	const parameters: Record<string, number | string> = { name: options.name }
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	const result = await exec('property:read', parameters, undefined, {
		...options,
		skipErrorCheck: true,
	})

	return result
}

/**
 * List aliases in the vault or for a specific file.
 *
 * CLI command: `aliases`
 * @param options - Command options.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.active - Show aliases for the active file.
 * @returns List of aliases.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function aliases(options?: PropertyAliasesOptions): Promise<string[]> {
	const parameters: Record<string, number | string> = {}
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path

	const flags: string[] = ['verbose']
	if (options?.active) flags.push('active')

	const output = await exec('aliases', parameters, flags, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseLines(output)
}

/**
 * Return the total number of aliases.
 *
 * CLI command: `aliases total`
 * @returns Total number of aliases.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function aliasTotal(options?: Vault): Promise<number> {
	const output = await exec('aliases', undefined, ['total'], options)

	return parseNumber(output)
}
