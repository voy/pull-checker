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
        var deferred = Q.defer();

        params = _.merge({
            user: this._user,
            repo: this._repo
        }, params);

        this._gh[section][method](params, function(err, res) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res);
            }
        });

        return deferred.promise;
    },

    getPullRequests: function() {
        return this._callApi('pullRequests', 'getAll');
    },

    getPullRequest: function(number) {
        return this._callApi('pullRequests', 'get', { number: number });
    },
};
