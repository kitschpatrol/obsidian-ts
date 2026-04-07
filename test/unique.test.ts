import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as file from '../src/commands/file'
import * as unique from '../src/commands/unique'
import { backupVault, restoreVault, setupVault } from './helpers'

beforeAll(() => {
	setupVault()
	backupVault()
})

afterAll(async () => {
	await restoreVault()
})

describe('create', () => {
	it('creates a unique note and increases the file total', async () => {
		const before = await file.total()
		await unique.create()
		const after = await file.total()
		expect(after).toBe(before + 1)
	})

	it('creates a unique note with content', async () => {
		const filesBefore = await file.list()
		await unique.create({ content: 'Unique content test' })
		const filesAfter = await file.list()

		const newFiles = filesAfter.filter((f) => !filesBefore.includes(f))
		expect(newFiles).toHaveLength(1)

		const content = await file.read({ path: newFiles[0] })
		expect(content).toContain('Unique content test')
	})
})
