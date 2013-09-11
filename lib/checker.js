var nStore = require('nstore');
    GitHubApi = require('node-github');//,
//    express = require('express');

console.log("I'm awake, I'm awake...");

function checkPullRequests() {
    console.log('checking available pull requests');
    setTimeout(checkPullRequests, 1000);
}

setTimeout(checkPullRequests, 1000);
