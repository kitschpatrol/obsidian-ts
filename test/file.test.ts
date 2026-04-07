import { access } from 'node:fs/promises'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as file from '../src/commands/file'
import { backupVault, readVaultFile, restoreVault, setupVault, VAULT_DIR } from './helpers'

/** Matches paths starting with "notes/" */
const NOTES_PREFIX_REGEX = /^notes\//
/** Matches paths ending with ".md" */
const MD_EXTENSION_REGEX = /\.md$/

beforeAll(() => {
	setupVault()
	backupVault()
})

afterAll(async () => {
	await restoreVault()
})

describe('list', () => {
	it('lists all files in the vault', async () => {
		const files = await file.list()
		expect(files).toContain('welcome.md')
		expect(files).toContain('notes/alpha.md')
		expect(files).toContain('deep/nested/file.md')
		expect(files.length).toBeGreaterThanOrEqual(11)
	})

	it('filters by folder', async () => {
		const files = await file.list({ folder: 'notes' })
		for (const f of files) {
			expect(f).toMatch(NOTES_PREFIX_REGEX)
		}

		expect(files).toContain('notes/alpha.md')
	})

	it('filters by extension', async () => {
		const files = await file.list({ ext: 'md' })
		for (const f of files) {
			expect(f).toMatch(MD_EXTENSION_REGEX)
		}
	})
})

describe('total', () => {
	it('returns the total file count', async () => {
		const n = await file.total()
		expect(n).toBeGreaterThanOrEqual(11)
	})
})

describe('info', () => {
	it('returns file metadata', async () => {
		const result = await file.info({ path: 'welcome.md' })
		expect(result.path).toBe('welcome.md')
		expect(result.name).toBe('welcome')
		expect(result.extension).toBe('md')
		expect(result.size).toBeGreaterThan(0)
	})
})

describe('read', () => {
	it('reads file content by path', async () => {
		const content = await file.read({ path: 'notes/alpha.md' })
		expect(content).toContain('Alpha Note')
		expect(content).toContain('[[beta]]')
	})

	it('reads file content by name', async () => {
		const content = await file.read({ file: 'welcome' })
		expect(content).toContain('welcome note')
	})
})

describe('create and delete', () => {
	it('creates a file with content', async () => {
		await file.create({ content: '# Integration Test', path: '_test_created.md' })
		const onDisk = await readVaultFile('_test_created.md')
		expect(onDisk).toContain('# Integration Test')
	})

	it('reads back created content through the API', async () => {
		await file.create({ content: 'hello from test', path: '_test_readback.md' })
		const content = await file.read({ path: '_test_readback.md' })
		expect(content).toBe('hello from test')
	})

	it('permanently deletes a file', async () => {
		await file.create({ content: 'temp', path: '_test_to_delete.md' })
		await file.delete({ path: '_test_to_delete.md', permanent: true })
		await expect(access(`${VAULT_DIR}/_test_to_delete.md`)).rejects.toThrow()
	})
})

describe('append', () => {
	it('appends content to a file', async () => {
		await file.create({ content: 'line one', path: '_test_append.md' })
		await file.append({ content: 'line two', path: '_test_append.md' })
		const onDisk = await readVaultFile('_test_append.md')
		expect(onDisk).toContain('line one')
		expect(onDisk).toContain('line two')
	})
})

describe('prepend', () => {
	it('prepends content to a file', async () => {
		await file.create({ content: 'original', path: '_test_prepend.md' })
		await file.prepend({ content: 'prepended', path: '_test_prepend.md' })
		const onDisk = await readVaultFile('_test_prepend.md')
		const prependIndex = onDisk.indexOf('prepended')
		const originalIndex = onDisk.indexOf('original')
		expect(prependIndex).toBeLessThan(originalIndex)
	})
})

describe('rename', () => {
	it('renames a file', async () => {
		await file.create({ content: 'rename me', path: '_test_rename_source.md' })
		await file.rename({ name: '_test_rename_target', path: '_test_rename_source.md' })
		const content = await file.read({ path: '_test_rename_target.md' })
		expect(content).toBe('rename me')
	})
})

describe('move', () => {
	it('moves a file to a new location', async () => {
		await file.create({ content: 'move me', path: '_test_move_source.md' })
		await file.move({ path: '_test_move_source.md', to: 'notes' })
		const content = await file.read({ path: 'notes/_test_move_source.md' })
		expect(content).toBe('move me')
	})
})
