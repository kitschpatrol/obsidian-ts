import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as file from '../src/commands/file'
import * as task from '../src/commands/task'
import { backupVault, readVaultFile, restoreVault, setupVault } from './helpers'

beforeAll(() => {
	setupVault()
	backupVault()
})

afterAll(() => {
	restoreVault()
})

describe('list', () => {
	it('lists tasks across the vault', async () => {
		const tasks = await task.list()
		const texts = tasks.map((t) => t.text)
		expect(texts).toContain('- [ ] Buy groceries')
		expect(texts).toContain('- [x] Write initial draft')
	})

	it('filters tasks by file path', async () => {
		const tasks = await task.list({ path: 'notes/alpha.md' })
		const texts = tasks.map((t) => t.text)
		expect(texts).toContain('- [ ] Complete the alpha review')
		expect(texts).toContain('- [x] Write initial draft')
		expect(texts).not.toContain('- [ ] Buy groceries')
	})
})

describe('total', () => {
	it('returns the total task count', async () => {
		const n = await task.total()
		expect(n).toBeGreaterThanOrEqual(11)
	})
})

describe('show', () => {
	it('shows a specific task by file and line', async () => {
		const tasks = await task.list({ path: 'tasks.md' })
		expect(tasks.length).toBeGreaterThan(0)
		const firstTask = tasks[0]
		const result = await task.show({ line: firstTask.line, path: firstTask.file })
		expect(typeof result).toBe('string')
		expect(result.length).toBeGreaterThan(0)
	})
})

describe('update', () => {
	it('toggles a task status in a temp file', async () => {
		await file.create({ content: '- [ ] Test task', path: '_test_task_toggle.md' })
		// Ensure the file is indexed before updating
		await file.read({ path: '_test_task_toggle.md' })
		await task.update({ done: true, line: 1, path: '_test_task_toggle.md' })
		const onDisk = await readVaultFile('_test_task_toggle.md')
		expect(onDisk).toContain('[x]')
	})
})
