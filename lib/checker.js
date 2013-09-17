// ------------------------------------------------------------------
// Requires and initialization
// ------------------------------------------------------------------

var util = require('util');

var nStore = require('nstore'),
    express = require('express');

var JobRunner = require('./runner.js'),
    PullRequest = require('./pullrequest.js'),
    GitHubApi = require('./ghapi.js').GitHubApi,
    config = require('./config.js');

var github = new GitHubApi(config.github).authenticate();

// TODO: parse options somewhere around here


var runner = new JobRunner({});

console.log('pull-checker is now awake');


// ------------------------------------------------------------------
// Pull request checking code
// ------------------------------------------------------------------

(new PullRequest(github)).getUnmergeableList()
    .then(function(pullReqs) {
        console.log(util.format('got %d unmergeable PRs', pullReqs.length));

        pullReqs.forEach(function(pr) {
            runner.runJobFor(pr).then(function(jobStatus) {
                console.log(util.format('pr %d finished with status %s', pr.number, jobStatus));
            });
        });
    })
    .done();

// ------------------------------------------------------------------
// Web interface
// ------------------------------------------------------------------

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
