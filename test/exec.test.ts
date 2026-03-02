import { beforeAll, describe, expect, it } from 'vitest'
import { configure, exec, getVault, ObsidianError, ObsidianNotFoundError } from '../src/exec'
import { setupVault, VAULT_NAME } from './helpers'

beforeAll(() => {
	setupVault()
})

describe('configure and getVault', () => {
	it('returns the configured vault name', () => {
		expect(getVault()).toBe(VAULT_NAME)
	})

	it('configure updates the vault', () => {
		configure({ vault: 'other-vault' })
		expect(getVault()).toBe('other-vault')
		configure({ vault: VAULT_NAME })
	})
})

describe('exec', () => {
	it('executes a CLI command and returns trimmed output', async () => {
		const result = await exec('version')
		expect(result).toMatch(/^\d+\.\d+\.\d+/)
	})

	it('passes flags', async () => {
		const result = await exec('files', undefined, ['total'])
		expect(Number.parseInt(result, 10)).toBeGreaterThan(0)
	})

	it('passes vault option', async () => {
		const result = await exec('files', undefined, ['total'], { vault: VAULT_NAME })
		expect(Number.parseInt(result, 10)).toBeGreaterThan(0)
	})
})

describe('error handling', () => {
	it('throws ObsidianNotFoundError when binary not found', async () => {
		configure({ binary: 'nonexistent-obsidian-binary-xyz' })
		try {
			await expect(exec('version')).rejects.toThrow(ObsidianNotFoundError)
		} finally {
			configure({ binary: 'obsidian' })
		}
	})

	it('returns error text in stdout for unknown commands (CLI exits 0)', async () => {
		// The Obsidian CLI exits 0 even for unknown commands, putting the error
		// message in stdout. This verifies the library throws an ObsidianError.
		await expect(exec('this-command-does-not-exist-xyz')).rejects.toThrow(ObsidianError)
	})
})
