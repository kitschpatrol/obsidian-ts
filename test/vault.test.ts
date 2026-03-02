import { beforeAll, describe, expect, it } from 'vitest'
import * as vault from '../src/commands/vault'
import { setupVault, VAULT_NAME } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('info', () => {
	it('returns vault metadata', async () => {
		const result = await vault.info()
		expect(result.name).toBe(VAULT_NAME)
		expect(result.path).toContain(VAULT_NAME)
		expect(result.files).toBeGreaterThanOrEqual(11)
	})
})

describe('list', () => {
	it('lists known vaults', async () => {
		const vaults = await vault.list()
		expect(vaults).toContain(VAULT_NAME)
	})
})

describe('total', () => {
	it('returns the vault total', async () => {
		const n = await vault.total()
		expect(n).toBeGreaterThanOrEqual(1)
	})
})

describe('listVerbose', () => {
	it('returns vaults with names and paths', async () => {
		const vaults = await vault.listVerbose()
		expect(vaults.length).toBeGreaterThanOrEqual(1)
		const match = vaults.find((v) => v.name === VAULT_NAME)
		expect(match).toBeDefined()
		expect(match!.path).toContain(VAULT_NAME)
	})
})
