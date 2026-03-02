import { beforeAll, describe, expect, it } from 'vitest'
import * as web from '../src/commands/web'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('open', () => {
	it('opens a URL in the Obsidian web browser view', async () => {
		const result = await web.open({ url: 'https://example.com' })
		expect(typeof result).toBe('string')
		expect(result.length).toBeGreaterThan(0)
	})
})
