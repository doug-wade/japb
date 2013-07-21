'use strict';

//Controllers

angular.module('japb.controllers', ['japb.services']).
  controller('IndexCtrl', function($scope, $http){
    $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
  }).

  controller('UserCtrl', function($scope, $http){
    $scope.form = {};
    $scope.registerUser = function() {
      $http.post('/api/user/register', $scope.form).
      success(function(data){
        $location.path('/');
      });
    };
    $http.get('/api/user').
    success(function(data, status, headers, config){
      $scope.user = data.username;
    });
  }).

  controller('AddPostCtrl', function($scope, $http, $location){
    $scope.form = {};
    $scope.submitPost = function() {
      $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
    };
  }).

  controller('ReadPostCtrl', function($scope, $http, $routeParams) {
    $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
  }).

  controller('EditPostCtrl', function($scope, $http, $location, $routeParams){
    $scope.form = {};
    $http.get('/api/post/' + $routeParams.id).
    success(function(data){
      $scope.post = data.post;
    });

    $scope.editPost = function(){
      $http.put('/api/post/' + $routeParams.id, $scope.post).
      success(function(data){
        $location.url('/readPost/' + $routeParams.id);
      }).
      error(function(err){
        console.log(err);
      });
    };
  }).

  controller('DeletePostCtrl', function($scope, $http, $location, $routeParams){
    $http.get('/api/post/' + $routeParams.id).
    success(function(data){
      $scope.post = data.post;
    });

    $scope.deletePost = function(){
      $http.delete('/api/post/' + $routeParams.id).
      success(function(data){
        $location.url('/');
      });
    };

    $scope.home = function(){
      $location.url('/');
    };
  })
