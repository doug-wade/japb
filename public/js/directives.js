'use strict';

/* Directives */


angular.module('japb.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('sameAs', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          if (viewValue == scope[attrs.sameAs]) {
            ctrl.$setValidity('sameAs', true);
            return viewValue;
          } else {
            ctrl.$setValidity('sameAs', false);
            return undefined;
          }
        });
      }
    };
  });
