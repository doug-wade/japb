'use strict';

/* Services */

angular.module('japb.services', ['ngResource']).
  factory('Phone', function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }).
  value('version', '0.1');
