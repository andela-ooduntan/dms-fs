(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Roles', ['$resource', function roleFactory($resource) {
      return $resource('/api/roles/:id', {
        id: '@id'
      }, {
        update: {
          // this method issues a PUT request
          method: 'PUT'
        }
      }, {
        stripTrailingSlashes: false
      });
    }]);

})();