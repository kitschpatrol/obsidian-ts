import type { Simplify } from 'type-fest'
import type { Vault } from '../types'
import { exec } from '../exec'

export type DevCdpOptions = Simplify<Vault & { method: string; params?: string }>

export type DevDebugOptions = Simplify<Vault & { enable: boolean }>

export type DevErrorsOptions = Simplify<Vault & { clear?: boolean }>

export type DevMobileOptions = Simplify<Vault & { enable: boolean }>

export type DevScreenshotOptions = Simplify<Vault & { path?: string }>

export type DevConsoleOptions = Simplify<
	Vault & {
		clear?: boolean
		level?: 'debug' | 'error' | 'info' | 'log' | 'warn'
		limit?: number
	}
>

export type DevCssOptions = Simplify<Vault & { prop?: string; selector: string }>

export type DevDomOptions = Simplify<
	Vault & {
		all?: boolean
		attr?: string
		css?: string
		inner?: boolean
		selector: string
		text?: boolean
		total?: boolean
	}
>

export type DevEvaluateOptions = Simplify<Vault & { code: string }>

/**
 * Toggle Electron dev tools.
 *
 * CLI command: `devtools`
 * @returns Status message.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function tools(options?: Vault): Promise<string> {
	const result = await exec('devtools', undefined, undefined, options)

	return result
}

/**
 * Attach or detach the Chrome DevTools Protocol debugger.
 *
 * CLI command: `dev:debug on|off`
 * @param options - Command options.
 * @param options.enable - `true` to attach, `false` to detach.
 * @returns Status message.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function debug(options: DevDebugOptions): Promise<string> {
	const result = await exec('dev:debug', undefined, [options.enable ? 'on' : 'off'], options)

	return result
}

/**
 * Run a Chrome DevTools Protocol command.
 *
 * CLI command: `dev:cdp`
 * @param options - Command options.
 * @param options.method - CDP method to call.
 * @param options.params - Method parameters as JSON string.
 * @returns The CDP method response.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function cdp(options: DevCdpOptions): Promise<string> {
	const parameters: Record<string, number | string> = { method: options.method }
	if (options.params) parameters.params = options.params
	const result = await exec('dev:cdp', parameters, undefined, options)

	return result
}

/**
 * Show captured error logs.
 *
 * CLI command: `dev:errors`
 * @param options - Command options.
 * @param options.clear - Pass `true` to clear the error buffer.
 * @returns Captured error logs.
 */
export async function errors(options?: DevErrorsOptions): Promise<string> {
	const flags: string[] = []
	if (options?.clear) flags.push('clear')
	return exec('dev:errors', undefined, flags.length > 0 ? flags : undefined, {
		...options,
		skipErrorCheck: true,
	})
}

/**
 * Take a screenshot of the Obsidian window.
 *
 * CLI command: `dev:screenshot`
 * @param options - Command options.
 * @param options.path - Output file path.
 * @returns The screenshot file path.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function screenshot(options?: DevScreenshotOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.path) parameters.path = options.path
	const result = await exec('dev:screenshot', parameters, undefined, options)

	return result
}

/**
 * Show captured console messages.
 *
 * CLI command: `dev:console`
 * @param options - Command options.
 * @param options.clear - Clear the console buffer.
 * @param options.limit - Max messages to show (default: 50).
 * @param options.level - Filter by log level: `log`, `warn`, `error`, `info`, or `debug`.
 * @returns Captured console messages.
 */
export async function console(options?: DevConsoleOptions): Promise<string> {
	const parameters: Record<string, number | string> = {}
	if (options?.limit !== undefined) parameters.limit = options.limit
	if (options?.level) parameters.level = options.level

	const flags: string[] = []
	if (options?.clear) flags.push('clear')

	return exec('dev:console', parameters, flags.length > 0 ? flags : undefined, {
		...options,
		skipErrorCheck: true,
	})
}

/**
 * Inspect computed CSS with source locations.
 *
 * CLI command: `dev:css`
 * @param options - Command options.
 * @param options.selector - CSS selector to inspect.
 * @param options.prop - Filter by CSS property name.
 * @returns Computed CSS properties with source locations.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function css(options: DevCssOptions): Promise<string> {
	const parameters: Record<string, number | string> = { selector: options.selector }
	if (options.prop) parameters.prop = options.prop
	const result = await exec('dev:css', parameters, undefined, options)

	return result
}

/**
 * Query DOM elements.
 *
 * CLI command: `dev:dom`
 * @param options - Command options.
 * @param options.selector - CSS selector to query.
 * @param options.total - Return element count.
 * @param options.text - Return text content.
 * @param options.inner - Return innerHTML instead of outerHTML.
 * @param options.all - Return all matches instead of first.
 * @param options.attr - Get attribute value by name.
 * @param options.css - Get CSS property value.
 * @returns DOM element data matching the selector.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function dom(options: DevDomOptions): Promise<string> {
	const parameters: Record<string, number | string> = { selector: options.selector }
	if (options.attr) parameters.attr = options.attr
	if (options.css) parameters.css = options.css

	const flags: string[] = []
	if (options.total) flags.push('total')
	if (options.text) flags.push('text')
	if (options.inner) flags.push('inner')
	if (options.all) flags.push('all')

	const result = await exec('dev:dom', parameters, flags.length > 0 ? flags : undefined, options)

	return result
}

/**
 * Toggle mobile emulation.
 *
 * CLI command: `dev:mobile on|off`
 * @param options - Command options.
 * @param options.enable - `true` to enable, `false` to disable mobile emulation.
 * @returns Status message.
 * @throws {ObsidianError} if the CLI returns an error.
 */
export async function mobile(options: DevMobileOptions): Promise<string> {
	const result = await exec('dev:mobile', undefined, [options.enable ? 'on' : 'off'], options)

	return result
}

/**
 * Execute JavaScript in the Obsidian runtime and return the result.
 *
 * CLI command: `eval`
 * @param options - Command options.
 * @param options.code - JavaScript code to execute (has access to the `app` context).
 * @returns The evaluation result.
 */
export async function evaluate(options: DevEvaluateOptions): Promise<string> {
	const parameters: Record<string, number | string> = { code: options.code }
	return exec('eval', parameters, undefined, { ...options, skipErrorCheck: true })
}
