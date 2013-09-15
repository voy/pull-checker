var GitHubWrapper = require('github'),
    Q = require('Q'),
    _ = require('lodash');

module.exports = GitHubApi;


function GitHubApi(config) {
    this._user = config.user;
    this._repo = config.repo;
    this._token = config.token;
    this._timeout = config.timeout || 5000;
}

GitHubApi.prototype = {
    authenticate: function() {
        var github = new GitHubWrapper({
            version: '3.0.0',
            timeout: this._timeout
        });

        github.authenticate({
            type: 'oauth',
            token: this._token
        });

        this._gh = github;

        return this;
    },

    // wraps node-github callback based api in a nicer promise-based one
    _callApi: function(section, method, params) {
        params = _.merge({
            user: this._user,
            repo: this._repo
        }, params);

        return Q.nfcall(this._gh[section][method], params);
    },

    getPullRequests: function() {
        return this._callApi('pullRequests', 'getAll');
    },

    getFullPullRequest: function(number) {
        return this._callApi('pullRequests', 'get', { number: number });
    },

    getFullPullRequests: function(numbers) {
        var result = [];

        var promises = numbers.map(function(number) {
            return this.getFullPullRequest(number);
        }.bind(this));

        return Q.all(promises);
    },

    _mapNumbers: function(prs) {
        return prs.map(function(pr) {
            return pr.number;
        });
    },

    _filterUnmergeable: function(prs) {
        return prs.filter(function(pr) {
            return !pr.mergeable;
        });
    },

    getFullUnmergeablePullRequests: function() {
        return this.getPullRequests()
            .then(this._mapNumbers.bind(this))
            .then(this.getFullPullRequests.bind(this))
            .then(this._filterUnmergeable.bind(this));
    }
};
