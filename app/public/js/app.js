'use strict';

// Declare app level module which depends on filters, and services
angular.module('japb', ['japb.controllers','japb.filters', 'japb.services', 'japb.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/home',
        controller: 'IndexCtrl'
      }).
      when('/addPost', {
        templateUrl: '/partials/addPost',
        controller: 'AddPostCtrl'
      }).
      when('/readPost/:id', {
        templateUrl: '/partials/readPost',
        controller: 'ReadPostCtrl'
      }).
      when('/editPost/:id', {
        templateUrl: '/partials/editPost',
        controller: 'EditPostCtrl'
      }).
      when('/deletePost/:id', {
        templateUrl: '/partials/deletePost',
        controller: 'DeletePostCtrl'
      }).
      when('/about', {
        templateUrl: '/partials/about',
        controller: 'IndexCtrl'
      }).
      when('/contact', {
        templateUrl: '/partials/contact',
        controller: 'IndexCtrl'
      }).
      when('/signin', {
        templateUrl: '/partials/signin',
        controller: 'SigninCtrl'
      }).
      when('/signup', {
        templateUrl: '/partials/signup',
        controller: 'SignupCtrl'
      }).
      when('/forgotPassword', {
        templateUrl: '/partials/forgotPassword',
        controller: 'UserCtrl'
      });
      /*.otherwise({
        redirectTo: '/'
      });*/
    $locationProvider.html5Mode(true);
  }]);
