'use strict';

var secret = 'YOUR SECRET HERE';

//Controllers
angular.module('japb.controllers', ['japb.services', 'ngCookies']).
  controller('IndexCtrl', function($scope, $http){
    $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
  }).

  controller('UserCtrl', function($scope, $http, $location, $cookies){
    $scope.master = {};

    $scope.registerUser = function(user){
      $http.post('/api/user/register', user).
      success(function(data){
        console.log(data);
        $cookies.userCookie = 'username=' + data.username + 
                              '&userId=' + data.userId;
        $location.path('/');
      });
    };

    $scope.login = function() {
      $http.post('/api/user/login', $scope.form).
      success(function(data){
        $cookies.userCookie = 'username=' + data.username + 
                              '&userId=' + data.userId;
        $location.path('/');
      });
    };

    $http.get('/api/user').
    success(function(data, status, headers, config){
      $scope.username = data.username;
    });
  }).

  controller('AddPostCtrl', function($scope, $http, $location){
    $scope.master = {};

    $scope.submitPost = function(post) {
      $http.post('/api/post', post).
      success(function(data) {
        console.log(data);
        $location.url('/readPost/' + data.id);
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
