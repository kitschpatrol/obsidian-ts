import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as bookmark from '../src/commands/bookmark'
import { backupVault, restoreVault, setupVault } from './helpers'

beforeAll(() => {
	setupVault()
	backupVault()
})

afterAll(() => {
	restoreVault()
})

describe('list', () => {
	it('returns bookmarks as JSON array', async () => {
		const result = await bookmark.list()
		expect(Array.isArray(result)).toBe(true)
		for (const b of result) {
			expect(b).toHaveProperty('type')
		}
	})
})

describe('total', () => {
	it('returns the bookmark total', async () => {
		const n = await bookmark.total()
		expect(typeof n).toBe('number')
	})
})

describe('add', () => {
	it('adds a file bookmark and increases the total', async () => {
		const before = await bookmark.total()
		await bookmark.add({ file: 'welcome.md', title: '_test_bookmark' })
		const after = await bookmark.total()
		expect(after).toBe(before + 1)
	})
})
