import { beforeAll, describe, expect, it } from 'vitest'
import * as hotkey from '../src/commands/hotkey'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('list', () => {
	it('returns hotkeys as JSON array', async () => {
		const result = await hotkey.list()
		expect(result).toBeInstanceOf(Array)
		expect(result.length).toBeGreaterThan(0)
	})
})

describe('total', () => {
	it('returns the hotkey total', async () => {
		const n = await hotkey.total()
		expect(n).toBeGreaterThan(0)
	})
})

describe('get', () => {
	it('returns the hotkey for a command', async () => {
		const result = await hotkey.get({ id: 'command-palette:open' })
		expect(typeof result).toBe('string')
	})
})
