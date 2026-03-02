import { beforeAll, describe, expect, it } from 'vitest'
import * as theme from '../src/commands/theme'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('list', () => {
	it('returns a list of installed themes', async () => {
		const themes = await theme.list()
		expect(Array.isArray(themes)).toBe(true)
		for (const t of themes) {
			expect(typeof t).toBe('string')
		}
	})
})

describe('info', () => {
	it('returns info about the current theme', async () => {
		const result = await theme.info()
		expect(typeof result).toBe('string')
	})
})
