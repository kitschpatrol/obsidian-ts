import type { Simplify } from 'type-fest'
import { z } from 'zod'
import type { FileOrPath, Vault, VaultFile } from '../types'
import { exec } from '../exec'
import { parseJsonWith, parseNumber, stripPrefix } from '../parse'

const taskInfoSchema = z.object({
	file: z.string(),
	line: z.coerce.number(),
	status: z.string(),
	text: z.string(),
})
export type TaskInfo = z.infer<typeof taskInfoSchema>

export type TaskListOptions = Simplify<
	FileOrPath &
		Vault & {
			active?: boolean
			daily?: boolean
			done?: boolean
			status?: string
			todo?: boolean
		}
>

export type TaskShowOptions = Simplify<
	VaultFile & {
		line?: number
		ref?: string
	}
>

export type TaskUpdateOptions = Simplify<
	VaultFile & {
		daily?: boolean
		done?: boolean
		line?: number
		ref?: string
		status?: string
		todo?: boolean
		toggle?: boolean
	}
>

/**
 * List tasks in the vault.
 *
 * CLI command: `tasks`
 * @param options - Command options.
 * @param options.file - Filter by file name.
 * @param options.path - Filter by file path.
 * @param options.done - Show completed tasks.
 * @param options.todo - Show incomplete tasks.
 * @param options.status - Filter by status character.
 * @param options.active - Show tasks for the active file.
 * @param options.daily - Show tasks from the daily note.
 * @returns Array of task objects with file, line, status, and text.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function list(options?: TaskListOptions): Promise<TaskInfo[]> {
	const parameters: Record<string, number | string> = { format: 'json' }
	if (options?.file) parameters.file = options.file
	if (options?.path) parameters.path = options.path
	if (options?.status) parameters.status = options.status

	const flags: string[] = ['verbose']
	if (options?.done) flags.push('done')
	if (options?.todo) flags.push('todo')
	if (options?.active) flags.push('active')
	if (options?.daily) flags.push('daily')

	const output = await exec('tasks', parameters, flags, options)

	if (output.startsWith('No ')) {
		return []
	}

	return parseJsonWith(output, z.array(taskInfoSchema))
}

/**
 * Return the total number of tasks.
 *
 * CLI command: `tasks total`
 * @returns Total number of tasks.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function total(options?: Vault): Promise<number> {
	const output = await exec('tasks', undefined, ['total'], options)

	return parseNumber(output)
}

/**
 * Show a specific task.
 *
 * CLI command: `task` (without modifiers)
 * @param options - Command options.
 * @param options.ref - Task reference as `path:line`.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.line - Line number.
 * @returns The task text.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function show(options: TaskShowOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options.ref) parameters.ref = options.ref
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	if (options.line !== undefined) parameters.line = options.line
	const result = await exec('task', parameters, undefined, { ...options, skipErrorCheck: true })

	return result
}

/**
 * Update a task's status.
 *
 * CLI command: `task` (with `toggle`, `done`, `todo`, or `status`)
 * @param options - Command options.
 * @param options.ref - Task reference as `path:line`.
 * @param options.file - File name.
 * @param options.path - File path.
 * @param options.line - Line number.
 * @param options.toggle - Toggle task status.
 * @param options.done - Mark as done.
 * @param options.todo - Mark as todo.
 * @param options.daily - Use the daily note.
 * @param options.status - Set status character.
 * @returns Confirmation string from the CLI.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function update(options: TaskUpdateOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options.ref) parameters.ref = options.ref
	if (options.file) parameters.file = options.file
	if (options.path) parameters.path = options.path
	if (options.line !== undefined) parameters.line = options.line
	if (options.status) parameters.status = options.status

	const flags: string[] = []
	if (options.toggle) flags.push('toggle')
	if (options.done) flags.push('done')
	if (options.todo) flags.push('todo')
	if (options.daily) flags.push('daily')

	const result = await exec('task', parameters, flags.length > 0 ? flags : undefined, options)

	return stripPrefix(result)
}
