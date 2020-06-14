module.exports = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	coverageReporters: ['text-summary', 'html', 'lcov'],
	reporters: [
		'default',
		[
			'jest-html-reporters',
			{ publicPath: './test-report', filename: 'index.html' }
		]
	]
};
