import { beforeAll, describe, expect, it } from 'vitest'
import * as template from '../src/commands/template'
import { setupVault } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('list', () => {
	it('lists available templates', async () => {
		const templates = await template.list()
		expect(templates).toContain('basic-template')
	})
})

describe('total', () => {
	it('returns the template total', async () => {
		const n = await template.total()
		expect(n).toBeGreaterThanOrEqual(1)
	})
})

describe('read', () => {
	it('reads template content', async () => {
		const content = await template.read({ name: 'basic-template' })
		expect(content).toContain('{{title}}')
		expect(content).toContain('{{date}}')
	})
})
