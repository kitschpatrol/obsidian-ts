import { beforeAll, describe, expect, it } from 'vitest'
import * as sync from '../src/commands/sync'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('status', () => {
	it('returns sync status as a string', async () => {
		const result = await sync.status()
		expect(typeof result).toBe('string')
	})
})
