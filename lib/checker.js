var util = require('util');

var nStore = require('nstore'),
    express = require('express');

var PullRequestFetcher = require('./fetcher.js'),
    JobRunner = require('./runner.js'),
    GitHubApi = require('./github.js'),
    config = require('./config.js');

var github = new GitHubApi(config.github).authenticate();

var runner = new JobRunner({});

var fetcher = new PullRequestFetcher({
    github: github
});

github.getFullUnmergeablePullRequests()
    .then(function(prs) {
        console.log(util.format('got %d unmergeable PRs', prs.length));

        prs.forEach(function(pr) {
            runner.runJobFor(pr).then(function(jobStatus) {
                console.log(util.format('pr %d finished with status %s', pr.number, jobStatus));
            });
        });
    })
    .done();

var app = express();

app.get('/', function(req, res) {
    var buffer = [];
    buffer.push('Unmergeable PRs:\n');
    runner.pendingJobs.forEach(function(pr) {
        buffer.push(pr.number + '\n');
    });
    res.send(buffer.join(''));
});

app.listen(8081);
