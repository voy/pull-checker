var util = require('util'),
    Q = require('q');

module.exports = PullRequestFetcher;


function PullRequestFetcher(config) {
    this._gh = config.github;
}

PullRequestFetcher.prototype = {
    getUnmergeablePRs: function() {
        console.log('checking available pull requests');
        return this._gh.getPullRequests().then(this._getFullUnmergeablePRs.bind(this));
    },

    _getFullUnmergeablePRs: function(prs) {
        console.log(util.format('downloading data about %d pull requests', prs.length));

        var result = [];

        var promises = prs.map(function(pr) {
            return this._gh.getPullRequest(pr.number)
                .then(function(prFull) {
                    prFull.mergeable || result.push(prFull);
                });
        }.bind(this));

        return Q.all(promises).then(function() {
            return result;
        });
    }
};

