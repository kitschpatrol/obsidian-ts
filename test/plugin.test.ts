import { beforeAll, describe, expect, it } from 'vitest'
import * as plugin from '../src/commands/plugin'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('list', () => {
	it('lists installed plugins', async () => {
		const plugins = await plugin.list()
		expect(plugins.length).toBeGreaterThan(0)
		expect(plugins[0]).toHaveProperty('id')
	})

	it('filters by core plugins', async () => {
		const plugins = await plugin.list({ filter: 'core' })
		expect(plugins.length).toBeGreaterThan(0)
	})
})

describe('enabled', () => {
	it('lists enabled plugins', async () => {
		const plugins = await plugin.enabled()
		expect(plugins.length).toBeGreaterThan(0)
		expect(plugins[0]).toHaveProperty('id')
	})
})

describe('info', () => {
	it('returns info for a core plugin', async () => {
		// Plugin info returns tab-separated key-value: type, name, enabled
		const result = await plugin.info({ id: 'file-explorer' })
		expect(result).toContain('core')
		expect(result).toContain('Files')
	})
})
