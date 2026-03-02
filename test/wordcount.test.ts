import { beforeAll, describe, expect, it } from 'vitest'
import * as wordcount from '../src/commands/wordcount'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('get', () => {
	it('returns word and character counts', async () => {
		const result = await wordcount.get({ path: 'notes/alpha.md' })
		expect(typeof result.words).toBe('number')
		expect(typeof result.characters).toBe('number')
		expect(result.words).toBeGreaterThan(0)
		expect(result.characters).toBeGreaterThan(0)
	})

	it('accepts a path option', async () => {
		const result = await wordcount.get({ path: 'welcome.md' })
		expect(typeof result.words).toBe('number')
		expect(typeof result.characters).toBe('number')
	})
})
