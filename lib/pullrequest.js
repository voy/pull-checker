var Q = require('Q'),
    _ = require('lodash'),
    util = require('util');

var extend = require('./util.js').extend,
    ghapi = require('./ghapi.js');


module.exports = PullRequest;


function PullRequest() {
    PullRequest.super_.apply(this, arguments);
}

util.inherits(PullRequest, ghapi.GitHubResource);

extend(PullRequest, {
    getList: function() {
        return this._gh.callApi('pullRequests', 'getAll');
    },

    getDetail: function(number) {
        return this._gh.callApi('pullRequests', 'get', { number: number });
    },

    getFullList: function(numbers) {
        var result = [];

        var promises = numbers.map(function(number) {
            return this.getDetail(number);
        }.bind(this));

        return Q.all(promises);
    },

    /**
     * Returns a promise for a full list of pull requests which have their
     * mergeable flag set to false.
     */
    getUnmergeableList: function() {
        return this.getList()
            .then(function(pullReqs) {
                return pullReqs.map(function(pr) {
                    return pr.number;
                });
            })
            .then(this.getFullList.bind(this))
            .then(function(pullReqs) {
                return pullReqs.filter(function(pr) {
                    return !pr.mergeable;
                });
            });
    }
});

