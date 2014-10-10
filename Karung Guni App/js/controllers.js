'use strict';

/* Controllers */
var myApplication = angular.module('myApplication', []);

myApplication.controller('ItemListCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('json/item.json').success(function(data) {
      $scope.items = data;
    });

    //$scope.orderProp = 'age';
  }]);