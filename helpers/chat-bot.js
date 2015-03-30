'use strict';

var Q = require('q');
var childProcess = require('child_process');

var chatBot = {

  generateResponse: function(query) {
    var deferred = Q.defer();

    var execString = Math.random() <= 0.85 ? 'python alice.py ' + '"'  + query + '"' : 'python generate_rude_text.py ' + '"'  + query + '"';

    childProcess.exec(execString, function(error, stdout, stderr) {
        deferred.resolve(stdout);
      })
    return deferred.promise;
  }

}

module.exports = chatBot;