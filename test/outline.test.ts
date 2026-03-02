import { beforeAll, describe, expect, it } from 'vitest'
import * as outline from '../src/commands/outline'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('show', () => {
	it('returns the heading outline as JSON', async () => {
		const result = await outline.show({ path: 'notes/gamma.md' })
		expect(result).toBeInstanceOf(Array)
		expect(result.length).toBe(6)

		const headings = result.map((h) => h.heading)
		expect(headings).toContain('Gamma Note')
		expect(headings).toContain('Section One')
		expect(headings).toContain('Subsection A')
	})

	it('includes heading levels', async () => {
		const result = await outline.show({ path: 'notes/gamma.md' })
		const h1 = result.find((h) => h.heading === 'Gamma Note')
		expect(h1?.level).toBe(1)

		const h3 = result.find((h) => h.heading === 'Subsection A')
		expect(h3?.level).toBe(3)
	})
})

describe('total', () => {
	it('throws when no active file', async () => {
		// Outline total without a file= param counts headings for the active file.
		// When no file is active, the CLI returns an error.
		await expect(outline.total()).rejects.toThrow()
	})

	it('returns heading count for a specific file', async () => {
		const n = await outline.total({ path: 'notes/gamma.md' })
		expect(n).toBe(6)
	})
})
