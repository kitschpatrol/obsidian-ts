import { beforeAll, describe, expect, it } from 'vitest'
import * as command from '../src/commands/command'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('list', () => {
	it('lists available commands', async () => {
		const commands = await command.list()
		expect(commands.length).toBeGreaterThan(0)
	})

	it('filters commands by prefix', async () => {
		const commands = await command.list({ filter: 'editor:' })
		for (const c of commands) {
			expect(c).toMatch(/^editor:/)
		}
	})
})
