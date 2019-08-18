#!/usr/bin/env node

const bot = require('circle-github-bot').create();
const https = require('https');

const ghtkn = process.env.GH_AUTH_TOKEN;
const buildEnv = process.env.CIRCLE_CI_WORKFLOW_BUILDS;
const username = process.env.CIRCLE_PROJECT_USERNAME;
const vcs = 'github';
const repo = process.env.CIRCLE_PROJECT_REPONAME;
const tkn = process.env.CIRCLE_CI_TOKEN;

let builds = buildEnv ? buildEnv.split(' ') : [];
builds = builds.filter(bld => bld);

Promise.all(builds.map(bld => getBuildData(vcs, username, repo, bld, tkn)))
	.then(artifacts => {
		let arts = artifacts.reduce((res, ar) => {
			res = res.concat(ar);
			return res;
		}, []);
		arts = arts.map(ar => ar.url).filter(ar => /index.(html|log)$/.test(ar));

		const coverage = arts.find(ar => /coverage/.test(ar));
		const test = arts.find(ar => /test-report/.test(ar));
		const release = arts.find(ar => /emantic-release/.test(ar));

		return comment(ghtkn, coverage, test, release);
	})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});

function getBuildData(system, account, project, build, token) {
	const host = 'circleci.com';
	const url = `/api/v1.1/project/${system}/${account}/${project}/${build}/artifacts?circle-token=${token}`;
	return fetch(host, url);
}

function fetch(host, url) {
	return new Promise((resolve, reject) => {
		console.log('url', url);
		const req = https.request(
			{
				hostname: host,
				path: url,
				method: 'GET',

				headers: { Accept: 'text/html' }
			},
			resp => {
				resp.setEncoding('utf-8');
				let data = '';

				resp.on('data', chunk => {
					data += chunk;
				});

				resp.on('end', () => {
					try {
						const res = JSON.parse(data);
						resolve(res);
					} catch (err) {
						reject(err);
					}
				});
			}
		);

		req.on('error', err => reject(err));

		req.end();
	});
}

function comment(token, coverage, test, release) {
	let body = `<h3>${bot.commitMessage()}</h3>`;
	if (coverage) {
		body += `<div>Coverage: <strong>${getLink(coverage)}</strong></div>`;
	}

	if (test) {
		body += `<div>Test results: <strong>${getLink(test)}</strong></div>`;
	}

	if (release) {
		body += `<div>Semantic release info: <strong>${getLink(release)}</strong></div>`;
	}

	bot.comment(token, body);
}

function getLink(url) {
	return `<a href=${url} target="_blank">report</a>`;
}
