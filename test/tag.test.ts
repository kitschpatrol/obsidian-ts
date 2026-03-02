import { beforeAll, describe, expect, it } from 'vitest'
import * as tag from '../src/commands/tag'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('list', () => {
	it('lists tags in the vault', async () => {
		const tags = await tag.list()
		const tagNames = tags.map((t) => t.tag)
		expect(tagNames).toContain('#important')
		expect(tagNames).toContain('#topic/science')
		expect(tagNames).toContain('#welcome')
	})

	it('lists tags for a specific file', async () => {
		const tags = await tag.list({ path: 'notes/alpha.md' })
		const tagNames = tags.map((t) => t.tag)
		expect(tagNames).toContain('#important')
		expect(tagNames).toContain('#topic/science')
	})
})

describe('total', () => {
	it('returns the total tag count', async () => {
		const n = await tag.total()
		expect(n).toBeGreaterThanOrEqual(8)
	})
})

describe('info', () => {
	it('returns tag occurrence info', async () => {
		const result = await tag.info({ name: 'important' })
		expect(result).toContain('alpha.md')
	})
})
