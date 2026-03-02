import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig({
	ignores: ['test/assets/obsidian-ts-test-vault/**'],
	md: {
		overridesEmbeddedScripts: {
			// Configure vault edge case
			'unicorn/no-null': 'off',
		},
	},
	type: 'lib',
})
