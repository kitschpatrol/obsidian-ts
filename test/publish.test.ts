import { beforeAll, describe, expect, it } from 'vitest'
import * as publish from '../src/commands/publish'
import { ObsidianError } from '../src/exec'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('site', () => {
	it('throws ObsidianError when publish plugin is not enabled', async () => {
		// Publish:site is not available when the Publish plugin is not enabled.
		// The CLI returns an error message starting with "Error:".
		await expect(publish.site()).rejects.toThrow(ObsidianError)
	})
})
