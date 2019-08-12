#!/usr/bin/env node

process.env.ARTIFACTS = `${process.env.ARTIFACTS}1`;
console.log(process.env.ARTIFACTS)