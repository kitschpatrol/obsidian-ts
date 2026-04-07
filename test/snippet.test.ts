import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as snippet from '../src/commands/snippet'
import { backupVault, restoreVault, setupVault } from './helpers'

beforeAll(async () => {
	setupVault()
	backupVault()

	// Wait for Obsidian to index the snippets directory. After a previous
	// test file's restoreVault() rebuilds the vault on disk, Obsidian needs
	// time to re-scan .obsidian/snippets/. Poll until the index is ready.
	for (let i = 0; i < 10; i++) {
		const snippets = await snippet.list()
		if (snippets.includes('test-snippet')) break
		await new Promise((resolve) => setTimeout(resolve, 500))
	}
})

afterAll(() => {
	restoreVault()
})

describe('list', () => {
	it('lists installed CSS snippets', async () => {
		const snippets = await snippet.list()
		expect(snippets).toContain('test-snippet')
	})
})

describe('enabled', () => {
	it('returns the list of enabled snippets', async () => {
		const enabled = await snippet.enabled()
		expect(Array.isArray(enabled)).toBe(true)
		for (const s of enabled) {
			expect(typeof s).toBe('string')
		}
	})
})

describe('enable and disable', () => {
	it('enables then disables a snippet', async () => {
		await snippet.enable({ name: 'test-snippet' })
		const afterEnable = await snippet.enabled()
		expect(afterEnable).toContain('test-snippet')

		await snippet.disable({ name: 'test-snippet' })
		const afterDisable = await snippet.enabled()
		expect(afterDisable).not.toContain('test-snippet')
	})
})
