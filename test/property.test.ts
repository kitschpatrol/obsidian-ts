import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as file from '../src/commands/file'
import * as property from '../src/commands/property'
import { backupVault, restoreVault, setupVault } from './helpers'

beforeAll(() => {
	setupVault()
	backupVault()
})

afterAll(async () => {
	await restoreVault()
})

describe('list', () => {
	it('lists properties in the vault as JSON', async () => {
		const props = await property.list()
		const names = props.map((p) => p.name)
		expect(names).toContain('title')
		expect(names).toContain('created')
		expect(names).toContain('status')
	})

	it('includes type information', async () => {
		const props = await property.list()
		const titleProp = props.find((p) => p.name === 'title')
		expect(titleProp?.type).toBe('text')
	})
})

describe('total', () => {
	it('returns the total property count', async () => {
		const n = await property.total()
		expect(n).toBeGreaterThanOrEqual(8)
	})
})

describe('read', () => {
	it('reads a property value from a file', async () => {
		const value = await property.read({ name: 'title', path: 'notes/alpha.md' })
		expect(value).toBe('Alpha Note')
	})

	it('reads a different property', async () => {
		const value = await property.read({ name: 'status', path: 'notes/alpha.md' })
		expect(value).toBe('active')
	})
})

describe('set and remove', () => {
	it('sets a property on a file and removes it', async () => {
		await file.create({ content: '# Property Test', overwrite: true, path: '_test_property.md' })
		// Ensure the file is indexed before setting properties
		await file.read({ path: '_test_property.md' })
		await property.set({ name: 'color', path: '_test_property.md', value: 'blue' })
		const value = await property.read({ name: 'color', path: '_test_property.md' })
		expect(value).toBe('blue')

		await property.remove({ name: 'color', path: '_test_property.md' })
	})
})

describe('aliases', () => {
	it('lists aliases in the vault with file paths', async () => {
		const aliases = await property.aliases()
		expect(aliases.some((a) => a.includes('Delta'))).toBe(true)
		expect(aliases.some((a) => a.includes('The Delta File'))).toBe(true)
	})
})

describe('aliasTotal', () => {
	it('returns the alias total', async () => {
		const n = await property.aliasTotal()
		expect(n).toBeGreaterThanOrEqual(2)
	})
})
