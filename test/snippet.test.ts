import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as snippet from '../src/commands/snippet'
import { backupVault, restoreVault, setupVault } from './helpers'

beforeAll(() => {
	setupVault()
	backupVault()
})

afterAll(async () => {
	await restoreVault()
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
