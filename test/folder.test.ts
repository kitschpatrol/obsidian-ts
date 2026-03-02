import { beforeAll, describe, expect, it } from 'vitest'
import * as folder from '../src/commands/folder'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('list', () => {
	it('lists folders in the vault', async () => {
		const folders = await folder.list()
		expect(folders).toContain('notes')
		expect(folders).toContain('deep')
		expect(folders).toContain('deep/nested')
		expect(folders).toContain('templates')
	})
})

describe('total', () => {
	it('returns the total folder count', async () => {
		const n = await folder.total()
		expect(n).toBeGreaterThanOrEqual(5)
	})
})

describe('info', () => {
	it('returns folder metadata as key-value record', async () => {
		const result = await folder.info({ path: 'notes' })
		expect(result).toHaveProperty('path', 'notes')
		expect(result).toHaveProperty('files')
		expect(result.files).toBeGreaterThan(0)
	})
})
