import { beforeAll, describe, expect, it } from 'vitest'
import * as general from '../src/commands/general'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('version', () => {
	it('returns an object with version and installer', async () => {
		const result = await general.version()
		expect(result).toHaveProperty('version')
		expect(result).toHaveProperty('installer')
		expect(result.version).toMatch(/^\d+\.\d+\.\d+/)
		expect(result.installer).toMatch(/^\d+\.\d+\.\d+/)
	})
})
