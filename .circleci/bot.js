#!/usr/bin/env node

const bot = require('circle-github-bot').create();

bot.comment(
	process.env.GH_AUTH_TOKEN,
	`
<h3>${bot.commitMessage()}</h3>
<div>Coverage: <strong>${bot.artifactLink('coverage/index.html', 'report')}</strong></div>
<div>Test results: <strong>${bot.artifactLink('test-report/index.html', 'report')}</strong></div>

`
);
