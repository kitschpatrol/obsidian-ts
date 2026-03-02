import { beforeAll, describe, expect, it } from 'vitest'
import * as history from '../src/commands/history'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('list', () => {
	it('returns files that have history versions', async () => {
		const files = await history.list()
		expect(files).toBeInstanceOf(Array)
	})
})

describe('show', () => {
	it('returns history for a file (may be empty)', async () => {
		const result = await history.show({ path: 'welcome.md' })
		expect(typeof result).toBe('string')
	})
})
