import { beforeAll, describe, expect, it } from 'vitest'
import * as workspace from '../src/commands/workspace'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('show', () => {
	it('returns the workspace tree as a string', async () => {
		const result = await workspace.show()
		expect(typeof result).toBe('string')
		expect(result.length).toBeGreaterThan(0)
	})
})

describe('tabs', () => {
	it('returns a list of open tabs', async () => {
		const tabs = await workspace.tabs()
		expect(Array.isArray(tabs)).toBe(true)
		expect(tabs.length).toBeGreaterThan(0)
		for (const t of tabs) {
			expect(typeof t).toBe('string')
		}
	})
})

describe('recents', () => {
	it('returns recently opened files', async () => {
		const recents = await workspace.recents()
		expect(Array.isArray(recents)).toBe(true)
		for (const r of recents) {
			expect(typeof r).toBe('string')
		}
	})
})

describe('recentTotal', () => {
	it('returns the recent file total', async () => {
		const n = await workspace.recentTotal()
		expect(typeof n).toBe('number')
	})
})

// Note: workspace:save, workspaces (list), workspace:delete, and workspace:load
// commands were unavailable in Obsidian CLI 1.12.4 but are available in 1.12.7+.
