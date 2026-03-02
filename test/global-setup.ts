import { cpSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const vaultDirectory = join(import.meta.dirname, 'assets', 'obsidian-ts-test-vault')
const backupDirectory = join(import.meta.dirname, 'assets', '.obsidian-ts-test-vault-backup')

/**
 * Back up the vault fixture before any tests run.
 */
export function setup(): void {
	if (existsSync(backupDirectory)) {
		rmSync(backupDirectory, { recursive: true })
	}

	cpSync(vaultDirectory, backupDirectory, { recursive: true })
}

/**
 * Restore the vault fixture from backup after all tests complete.
 */
export function teardown(): void {
	if (existsSync(backupDirectory)) {
		rmSync(vaultDirectory, { recursive: true })
		cpSync(backupDirectory, vaultDirectory, { recursive: true })
		rmSync(backupDirectory, { recursive: true })
	}
}
