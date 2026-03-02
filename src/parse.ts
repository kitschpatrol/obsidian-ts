import type { ZodType } from 'zod'

/**
 * Parse key-value output into a typed record.
 *
 * Handles output in the format `key\tvalue\n` (tab-separated) or
 * `key: value\n` (colon-space separated) as returned by commands
 * like `file`, `vault`, and `wordcount`.
 */
export function parseKeyValue(output: string): Record<string, string> {
	const result: Record<string, string> = {}
	for (const line of output.split('\n')) {
		const trimmed = line.trim()
		if (!trimmed) continue

		const tabIndex = trimmed.indexOf('\t')
		if (tabIndex !== -1) {
			result[trimmed.slice(0, tabIndex)] = trimmed.slice(tabIndex + 1)
			continue
		}

		const colonIndex = trimmed.indexOf(': ')
		if (colonIndex !== -1) {
			result[trimmed.slice(0, colonIndex)] = trimmed.slice(colonIndex + 2)
		}
	}

	return result
}

/**
 * Split CLI output into an array of trimmed, non-empty lines.
 *
 * Used by list commands like `files`, `folders`, `tags`, etc.
 */
export function parseLines(output: string): string[] {
	if (!output) return []
	return output
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
}

/**
 * Parse key-value output and validate it against a Zod schema.
 *
 * Combines {@link parseKeyValue} with Zod validation and coercion.
 */
export function parseKeyValueWith<T>(output: string, schema: ZodType<T>): T {
	return schema.parse(parseKeyValue(output))
}

/**
 * Parse JSON output from the CLI and validate it against a Zod schema.
 *
 * Combines `JSON.parse` with Zod validation and coercion.
 */
export function parseJsonWith<T>(output: string, schema: ZodType<T>): T {
	return schema.parse(JSON.parse(output))
}

/**
 * Remove the prefix up to and including the first colon, then trim.
 *
 * Used by action commands that return confirmation strings like
 * `Opened: welcome.md` or `Enabled: daily-notes`.
 */
export function stripPrefix(output: string): string {
	const colonIndex = output.indexOf(':')
	if (colonIndex !== -1) {
		return output.slice(colonIndex + 1).trim()
	}

	return output.trim()
}

/**
 * Parse a single integer from CLI output.
 *
 * Used by `total` flag results that return a count.
 */
export function parseNumber(output: string): number {
	const n = Number.parseInt(output.trim(), 10)
	if (Number.isNaN(n)) {
		throw new TypeError(`Expected a number but got: ${output.trim()}`)
	}
	return n
}
