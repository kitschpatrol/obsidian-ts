import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		// Tests share a single live Obsidian vault and must run sequentially
		fileParallelism: false,
		globalSetup: 'test/global-setup.ts',
		testTimeout: 30_000,
	},
})
