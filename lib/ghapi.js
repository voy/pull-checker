var GitHubWrapper = require('github'),
    Q = require('Q'),
    _ = require('lodash');


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
    callApi: function(section, method, params) {
        params = _.merge({
            user: this._user,
            repo: this._repo
        }, params);

        return Q.nfcall(this._gh[section][method], params);
    }
};


function GitHubResource(gitHubApi) {
    this._gh = gitHubApi;
}


module.exports = {
    GitHubApi: GitHubApi,
    GitHubResource: GitHubResource
};
