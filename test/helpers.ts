import { cpSync, mkdtempSync, rmSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { configure } from '../src/exec'

export const VAULT_NAME = 'obsidian-ts-test-vault'
export const VAULT_DIR = join(import.meta.dirname, 'assets', 'obsidian-ts-test-vault')

/**
 * `true` on Windows. Write commands in the Obsidian CLI hang on Windows
 * (the IPC call never returns a response, even though reads work fine).
 * Use with `it.skipIf(isWindows)` to skip write-dependent tests until
 * the upstream CLI is fixed.
 */
export const isWindows = process.platform === 'win32'

let backupDirectory: string | undefined

/**
 * Configure the library to target the test vault.
 */
export function setupVault(): void {
	configure({ vault: VAULT_NAME })
}

/**
 * Back up the fixture vault to a temp directory before write tests.
 * Call this in a `beforeAll` for test files that modify vault contents.
 */
export function backupVault(): void {
	backupDirectory = mkdtempSync(join(tmpdir(), 'obsidian-ts-test-'))
	cpSync(VAULT_DIR, backupDirectory, { recursive: true })
}

/**
 * Restore the fixture vault from the temp backup after write tests.
 * Call this in an `afterAll` for test files that modify vault contents.
 */
export function restoreVault(): void {
	if (!backupDirectory) return

	rmSync(VAULT_DIR, { recursive: true })
	cpSync(backupDirectory, VAULT_DIR, { recursive: true })
	rmSync(backupDirectory, { recursive: true })
	backupDirectory = undefined
}

/**
 * Read a file from the vault directory on disk (bypasses the CLI).
 */
export async function readVaultFile(relativePath: string): Promise<string> {
	return readFile(join(VAULT_DIR, relativePath), 'utf8')
}
