import { beforeAll, describe, expect, it } from 'vitest'
import * as link from '../src/commands/link'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('backlinks', () => {
	it('lists files linking to a target', async () => {
		const results = await link.backlinks({ path: 'notes/alpha.md' })
		const files = results.map((r) => r.file)
		expect(files).toContain('notes/beta.md')
		expect(files).toContain('notes/gamma.md')
		expect(files).toContain('welcome.md')
	})
})

describe('backlinkTotal', () => {
	it('returns the backlink count', async () => {
		const n = await link.backlinkTotal({ path: 'notes/alpha.md' })
		expect(n).toBe(3)
	})
})

describe('outgoing', () => {
	it('lists outgoing links from a file', async () => {
		const results = await link.outgoing({ path: 'notes/alpha.md' })
		expect(results).toContain('notes/beta.md')
		expect(results).toContain('notes/gamma.md')
		expect(results).toContain('notes/deadend.md')
	})
})

describe('outgoingTotal', () => {
	it('returns the outgoing link count', async () => {
		const n = await link.outgoingTotal({ path: 'notes/alpha.md' })
		expect(n).toBe(3)
	})
})

describe('unresolved', () => {
	it('returns empty array when no unresolved links exist', async () => {
		const results = await link.unresolved()
		expect(results).toBeInstanceOf(Array)
		expect(results.length).toBe(0)
	})
})

describe('unresolvedTotal', () => {
	it('returns zero unresolved links', async () => {
		const n = await link.unresolvedTotal()
		expect(n).toBe(0)
	})
})

describe('orphans', () => {
	it('lists files with no incoming links', async () => {
		const results = await link.orphans()
		expect(results).toContain('notes/orphan.md')
		expect(results).toContain('notes/delta.md')
		// Alpha has incoming links, so it should NOT be an orphan
		expect(results).not.toContain('notes/alpha.md')
	})
})

describe('orphanTotal', () => {
	it('returns the orphan count', async () => {
		const n = await link.orphanTotal()
		expect(n).toBeGreaterThanOrEqual(5)
	})
})

describe('deadEnds', () => {
	it('lists files with no outgoing links', async () => {
		const results = await link.deadEnds()
		expect(results).toContain('notes/deadend.md')
		expect(results).toContain('notes/orphan.md')
		expect(results).toContain('notes/delta.md')
		// Alpha has outgoing links, so it should NOT be a deadend
		expect(results).not.toContain('notes/alpha.md')
	})
})

describe('deadEndTotal', () => {
	it('returns the dead-end count', async () => {
		const n = await link.deadEndTotal()
		expect(n).toBeGreaterThanOrEqual(5)
	})
})
