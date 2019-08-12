#!/usr/bin/env node

const bot = require('circle-github-bot').create();

const username = process.env.CIRCLE_PROJECT_USERNAME;
const vcs = 'github';
const project = process.env.CIRCLE_PROJECT_REPONAME;
const build = process.env.CIRCLE_BUILD_NUM;
const token = 'b7af2c8069b9bbd480aef1f7cdbe02e2b74f9873';
const artifacts = process.env.ARTIFACTS;
console.log(username, vcs, project, build, token, artifacts);
bot.comment(
	process.env.GH_AUTH_TOKEN,
	`${artifacts}
<h3>${bot.commitMessage()}</h3>
<div>Coverage: <strong>${bot.artifactLink('coverage/index.html', 'report')}</strong></div>
<div>Test results: <strong>${bot.artifactLink('test-report/index.html', 'report')}</strong></div>
<div>Semantic release info: <strong>${bot.artifactLink(
		'semantic-release/index.log',
		'log'
	)}</strong></div>
`
);
