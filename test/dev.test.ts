import { beforeAll, describe, expect, it } from 'vitest'
import * as dev from '../src/commands/dev'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('errors', () => {
	it('returns captured errors (may be empty)', async () => {
		const result = await dev.errors()
		expect(typeof result).toBe('string')
	})
})

describe('console', () => {
	it('returns captured console output (may be empty)', async () => {
		await dev.debug({
			enable: true,
		})
		const result = await dev.console()
		await dev.debug({
			enable: false,
		})
		expect(typeof result).toBe('string')
	})
})

describe('evaluate', () => {
	it('evaluates JavaScript in the Obsidian runtime', async () => {
		const result = await dev.evaluate({ code: '1 + 1' })
		expect(result).toContain('2')
	})
})
