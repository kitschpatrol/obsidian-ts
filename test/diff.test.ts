import { beforeAll, describe, expect, it } from 'vitest'
import * as diff from '../src/commands/diff'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('diff', () => {
	it('returns diff output for a file (may be empty if no history)', async () => {
		const result = await diff.diff({ path: 'welcome.md' })
		expect(typeof result).toBe('string')
	})
})
