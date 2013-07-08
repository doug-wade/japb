'use strict';

/* Services */

angular.module('japb.services', ['ngResource']).
  factory('Post', function($resource){
    return $resource('api/post/:id');
  });
  /* Maybe this is a thing that would work?
  factory('Post', function($resource){
    return $resource('api/post/:id', {}, {
      query: {method:'GET', params:{ id:'@id'}, isArray:true},
      get: {method:'GET', params:{id: '@id'}},
      delete: {method:'DELETE', params:{id: '@id'}},
      save: {method:'PUT', params:{id: '@id'}},
      create: {method: 'POST', params:{id:'@id'}}
    });
  }).
  value('version', '0.1');
  */