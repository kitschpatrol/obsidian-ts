import { beforeAll, describe, expect, it } from 'vitest'
import * as base from '../src/commands/base'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('list', () => {
	it('returns an array of base files', async () => {
		const bases = await base.list()
		expect(Array.isArray(bases)).toBe(true)
		for (const b of bases) {
			expect(typeof b).toBe('string')
		}
	})
})
