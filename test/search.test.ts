import { beforeAll, describe, expect, it } from 'vitest'
import * as search from '../src/commands/search'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('query', () => {
	it('finds files matching a search term', async () => {
		const results = await search.query({ query: 'UniqueSearchTerm42' })
		expect(results).toContain('search-target.md')
	})

	it('limits search to a folder', async () => {
		const results = await search.query({ path: 'notes', query: 'alpha' })
		for (const r of results) {
			expect(r).toMatch(/^notes\//)
		}
	})

	it('supports case-sensitive search', async () => {
		const results = await search.query({ case: true, query: 'CaseSensitiveTest' })
		expect(results).toContain('search-target.md')
	})
})

describe('total', () => {
	it('returns the number of matching files', async () => {
		const n = await search.total({ query: 'UniqueSearchTerm42' })
		expect(n).toBe(1)
	})
})

describe('context', () => {
	it('returns matching lines with context', async () => {
		const results = await search.context({ query: 'UniqueSearchTerm42' })
		expect(results).toBeInstanceOf(Array)
		expect(results.length).toBeGreaterThan(0)
		const files = results.map((r) => r.file)
		expect(files).toContain('search-target.md')
		const match = results.find((r) => r.file === 'search-target.md')
		expect(match?.matches.some((m) => m.text.includes('UniqueSearchTerm42'))).toBe(true)
	})
})
