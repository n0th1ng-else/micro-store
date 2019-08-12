module.exports = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	coverageReporters: ['text-summary', 'html'],
	reporters: [
		'default',
		['jest-html-reporters', { publicPath: './test-report', filename: 'index.html' }]
	]
};
