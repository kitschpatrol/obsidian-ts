import { beforeAll, describe, expect, it } from 'vitest'
import * as random from '../src/commands/random'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('read', () => {
	it('returns a non-empty string', async () => {
		const result = await random.read()
		expect(typeof result).toBe('string')
		expect(result.length).toBeGreaterThan(0)
	})
})
