import { beforeAll, describe, expect, it } from 'vitest'
import * as general from '../src/commands/general'
import { setupVault } from './helpers'

/** Matches semver-like version strings */
const SEMVER_PREFIX_REGEX = /^\d+\.\d+\.\d+/

beforeAll(() => {
	setupVault()
})

describe('version', () => {
	it('returns an object with version and installer', async () => {
		const result = await general.version()
		expect(result).toHaveProperty('version')
		expect(result).toHaveProperty('installer')
		expect(result.version).toMatch(SEMVER_PREFIX_REGEX)
		expect(result.installer).toMatch(SEMVER_PREFIX_REGEX)
	})
})
