var Q = require('Q'),
    _ = require('lodash');

var extend = require('./util.js').extend,
    ghapi = require('./ghapi.js');


module.exports = GitHubApi;


function PullRequest() {
    PullRequest.super_.apply(this, arguments);
}

util.inherits(PullRequest, ghapi.GitHubResource);

extend(PullRequest, {
    getList: function() {
        return this._callApi('pullRequests', 'getAll');
    },

    getFullPR: function(number) {
        return this._callApi('pullRequests', 'get', { number: number });
    },

    getFullList: function(numbers) {
        var result = [];

        var promises = numbers.map(function(number) {
            return this.getFullPullRequest(number);
        }.bind(this));

        return Q.all(promises);
    },

    /**
     * Returns a promise for a full list of pull requests which have their
     * mergeable flag set to false.
     */
    getUnmergeableList: function() {
        return this.getList()
            .then(function(prs) {
                return prs.map(function(pr) {
                    return pr.number;
                });
            })
            .then(this.getFullList.bind(this))
            .then(function(pr) {
                return !pr.mergeable;
            });
    }
});

