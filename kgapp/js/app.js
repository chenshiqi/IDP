var myApplication = angular.module('myApplication', ['ngRoute', 'angularModalService', 'angularFileUpload']);

myApplication.config(function ($routeProvider) {
    $routeProvider.when('/welcome', {templateUrl: 'partials/welcome.html', controller: ''});
    $routeProvider.when('/all_listings', {templateUrl: 'partials/all_listings.html', controller: 'ItemListCtrl'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
    $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: ''});
    $routeProvider.when('/register/seller', {templateUrl: 'partials/register_seller.html', controller: ''});
    $routeProvider.when('/register/buyer', {templateUrl: 'partials/register_buyer.html', controller: ''});
    $routeProvider.when('/add-item', {templateUrl: 'partials/add_item.html', controller: ''}); //to add controller for addItem
    $routeProvider.when('/edit-item', {templateUrl: 'partials/edit_item.html', controller: 'EditItemCtrl'}); //route according to item ID
    $routeProvider.when('/faq', {templateUrl: 'partials/faq.html', controller: ''});
    $routeProvider.when('/seller/profile/monicacheng', {templateUrl: 'partials/seller_profile.html'});
    $routeProvider.when('/seller/profile/monicacheng/send-offer', {templateUrl: 'partials/send_offer.html'});
    $routeProvider.when('/buyer/profile/onglyetat', {templateUrl: 'partials/buyer_profile.html'});
    $routeProvider.when('/seller/monicacheng/myoffers', {templateUrl: 'partials/offer_seller.html'});
    $routeProvider.when('/buyer/onglyetat/myoffers', {templateUrl: 'partials/offer_buyer.html'});
    $routeProvider.when('/leave-feedback', {templateUrl: 'partials/feedback.html'});
    $routeProvider.when('/send-offer', {templateUrl: 'partials/send_offer.html'});
    $routeProvider.otherwise({redirectTo: '/welcome'});
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

myApplication.controller('MainController', function ($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
});

myApplication.controller('LoginCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('json/users.json').success(function (data) {
            $scope.users = data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].email == email && data[i].password == password) {
                    window.location.href = "/kgapp/index_seller.html";
                }
            }
        });

    }]);

myApplication.controller('EditItemCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('json/Item.json').success(function (data) {
            $scope.items = data;
        });

    }]);

myApplication.controller('SellerUserCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('json/Seller.json').success(function (data) {
            $scope.seller = data;
        });

    }]);

myApplication.controller('BuyerUserCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('json/Buyer.json').success(function (data) {
            $scope.buyer = data;
        });

    }]);

myApplication.controller('BuyerDealsCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('json/BuyerDeals.json').success(function (data) {
            $scope.items = data;
        });

    }]);

//to assign logic of displaying correct nav bar based on user log in
$(function () {
    $("#includedBuyerNavBar").load("./templates/navBuyer.html");
});

$(function () {
    $("#includedSellerNavBar").load("./templates/navSeller.html");
});

$(function () {
    $("#includedNavBar").load("./templates/nav.html");
});

myApplication.controller('ModalServiceCtrl', function ($scope, ModalService) {

    $scope.show = function () {
        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "ModalCloseCtrl"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                $scope.message = "You said " + result;
            });
        });
    };

});

myApplication.controller('ModalServiceFeedbackCtrl', function ($scope, ModalService) {

    $scope.show = function () {
        ModalService.showModal({
            templateUrl: 'feedback.html',
            controller: "ModalCloseCtrl"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                $scope.message = "You said " + result;
            });
        });
    };

});

myApplication.controller('ModalCloseCtrl', function ($scope, close) {

    $scope.close = function (result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };


});

myApplication.controller('UploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
        var uploader = $scope.uploader = new FileUploader({
            url: 'upload.json'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    }]);