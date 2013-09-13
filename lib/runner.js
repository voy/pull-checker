var util = require('util'),
    Q = require('q');

module.exports = JobRunner;


function JobRunner(options) {
    this.pendingJobs = [];

    this._pollingInterval = options.pollingInterval || 500;
    this._jobUrl = options.jobUrl;
}

JobRunner.prototype = {
    runJobFor: function(pr) {
        this.pendingJobs.push(pr);

        var deferred = Q.defer();

        setTimeout(function() {
            deferred.resolve(Math.random() > 0.5);
        });

        return deferred.promise;
    },

    _triggerJob: function() {

    },

    _checkJob: function() {
    },

    _scheduleCheck: function() {
        var deferred = Q.defer;

        setTimeout(function() {
        }, this._pollingInterval);

        return deferred.promise;
    }
};
