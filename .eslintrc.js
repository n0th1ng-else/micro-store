module.exports = {
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.ts']
			}
		}
	},
	env: {
		browser: true,
		es6: true,
		node: true,
		jest: true
	},
	extends: ['airbnb-base', 'prettier'],
	plugins: ['@typescript-eslint', 'prettier'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	rules: {
		'prettier/prettier': ['error'],
		'no-unused-vars': 'warn',
		'import/extensions': 'off'
	}
};
