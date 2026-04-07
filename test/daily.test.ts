import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as daily from '../src/commands/daily'
import * as file from '../src/commands/file'
import { backupVault, restoreVault, setupVault } from './helpers'

/** Matches "YYYY-MM-DD.md" daily note paths */
const DATE_PATH_REGEX = /^\d{4}-\d{2}-\d{2}\.md$/

let dailyPath: string | undefined

beforeAll(async () => {
	setupVault()
	backupVault()
	// Capture the daily path early so afterAll can always clean up,
	// even if individual tests fail.
	// eslint-disable-next-line unicorn/no-useless-undefined
	dailyPath = await daily.path().catch(() => undefined)
})

afterAll(async () => {
	// Clean up the daily note so Obsidian's index doesn't retain a ghost
	// entry after the file is removed by restoreVault.
	if (dailyPath) {
		await file.delete({ path: dailyPath, permanent: true }).catch(() => {
			// No op
		})
	}

	restoreVault()
})

describe('path', () => {
	it('returns a date-formatted file path', async () => {
		dailyPath = await daily.path()
		expect(dailyPath).toMatch(DATE_PATH_REGEX)
	})
})

describe('daily note operations', () => {
	it('creates, reads, appends, and prepends to the daily note', async () => {
		dailyPath = await daily.path()

		// Use overwrite to ensure the file is created on disk even if
		// Obsidian's index has a ghost entry from a previous run.
		await file.create({ content: 'Daily test content', overwrite: true, path: dailyPath })

		// Read it back via CLI
		const content = await daily.read()
		expect(content).toContain('Daily test content')

		// Append content
		await daily.append({ content: 'appended to daily' })
		const afterAppend = await file.read({ path: dailyPath })
		expect(afterAppend).toContain('appended to daily')

		// Prepend content
		await daily.prepend({ content: 'prepended to daily' })
		const afterPrepend = await file.read({ path: dailyPath })
		expect(afterPrepend).toContain('prepended to daily')
	})
})
