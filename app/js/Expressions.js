angular.module('calculator.data', ['ngResource']).factory('Expressions', ['$resource', function($resource) {
    'use strict';
    
    var server = $resource('/expressions');
    
    return {
        save: function (newExpression) {
            server.save(newExpression);
        },
        
        query: function () {
            return server.query();
        }
    };
}]);