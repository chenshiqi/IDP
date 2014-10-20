var myApplication = angular.module('myApplication', ['ngRoute']);

myApplication.config(function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/welcome.html', controller: ''});
    $routeProvider.when('/welcome', {templateUrl: 'partials/welcome.html', controller:''});
    $routeProvider.when('/all_listings', {templateUrl: 'partials/all_listings.html', controller: 'ItemListCtrl'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
    $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: ''});
    $routeProvider.when('/register/seller', {templateUrl: 'partials/register_seller.html', controller: ''});
    $routeProvider.when('/register/buyer', {templateUrl: 'partials/register_buyer.html', controller: ''});
    $routeProvider.when('/add-item', {templateUrl: 'partials/add_item.html', controller:''}); //to add controller for addItem
    $routeProvider.when('/edit-item', {templateUrl: 'partials/edit_item.html', controller:'EditItemCtrl'});
    $routeProvider.when('/faq', {templateUrl: 'partials/faq.html', controller:''});
    $routeProvider.when('/seller/profile/monicacheng', {templateUrl: 'partials/seller_profile.html'});
    $routeProvider.when('/seller/profile/monicacheng/send-offer', {templateUrl: 'partials/send_offer.html'});
    $routeProvider.when('/buyer/profile/onglyetat', {templateUrl: 'partials/buyer_profile.html'});
});

myApplication.factory('dataFactory', function () {
    var items = [{name: 'Newspaper', timestamp: 1, type: 'paper'}, {name: 'Table', timestamp: 2, type: 'furniture'}, {name: 'Handphone', timestamp: 3, type: 'electronics'}];
    var objFactory = {};
    objFactory.getItems = function () {
        return items;
    };
    objFactory.pushItem = function (item) {
        item.timestamp = Math.round(new Date().getTime() / 1000.0);
        items.push(item);
    };
    return objFactory;
});

function BasicController($scope, dataFactory) {
    $scope.items = dataFactory.getItems();
    $scope.addItem = function () {
        dataFactory.pushItem($scope.newItem);
        $scope.newItem = {};
    };
}


//myApplication.controller('BasicController', BasicController);
myApplication.controller('ItemListCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('json/Item.json').success(function (data) {
            $scope.items = data;
        });
    }]);

 myApplication.controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
 });
 
myApplication.controller('LoginCtrl', ['$scope', '$http',
    function ($scope, $http) {
        
    }]);

myApplication.controller('EditItemCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $http.get('json/Item.json').success(function (data){
           $scope.items = data; 
        });
    
}]);

myApplication.controller('SellerUserCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $http.get('json/Seller.json').success(function (data){
           $scope.seller = data; 
        });
    
}]);

myApplication.controller('BuyerUserCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $http.get('json/Buyer.json').success(function (data){
           $scope.buyer = data; 
        });
    
}]);

$(function () {
    $("#includedBuyerNavBar").load("./templates/navBuyer.html");
});

$(function () {
    $("#includedSellerNavBar").load("./templates/navSeller.html");
});

$(function () {
    $("#includedNavBar").load("./templates/nav.html");
});

