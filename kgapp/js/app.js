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
    $routeProvider.when('/seller/profile/monicacheng1', {templateUrl: 'partials/seller_profile_Pending.html'});
    $routeProvider.when('/seller/profile/monicacheng/send-offer', {templateUrl: 'partials/send_offer.html'});
    $routeProvider.when('/buyer/profile/onglyetat', {templateUrl: 'partials/buyer_profile.html'});
    $routeProvider.when('/seller/monicacheng/myoffers', {templateUrl: 'partials/offer_seller.html'});
    $routeProvider.when('/buyer/onglyetat/myoffers', {templateUrl: 'partials/offer_buyer.html'});
    $routeProvider.when('/leave-feedback', {templateUrl: 'partials/feedback.html'});
    $routeProvider.when('/send-offer', {templateUrl: 'partials/send_offer.html'});


    $routeProvider.when('/index_seller', {templateUrl:'index_seller.html', controller:'LoginCtrl'});
    $routeProvider.when('/index_buyer', {templateUrl:'index_buyer.html', controller:'LoginCtrl'});
    $routeProvider.otherwise({redirectTo:'/welcome'});

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
 myApplication.controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
     $("#includedNavBar").load("./templates/nav.html");
     
 });



 
myApplication.controller('LoginCtrl', function ($scope, $http,$rootScope, $location) {

    $http.get('json/users.json').success(function(data){
        $scope.users = data;   
        var name;
        var pos;
            $scope.login = function(){
                for(var i = 0; i < data.length; i++){
                if(data[i].email == $scope.email && data[i].password == $scope.password){
                    

                    name = data[i].name;
                    $rootScope.name = name;
                    $scope.name = name;
                    pos = i;
                    var type = data[i].type;
                    $scope.type = type;
                    console.log(name);
                    console.log($scope.type);
                    //window.location.href= "/kgapp/index_" + data[i].type+ ".html";
                    $location.path('/all_listings');
                    if($scope.type == 'seller'){
                        $("#includedNavBar").load("./templates/navSeller.html");
                    }else if($scope.type == 'buyer'){
                        $("#includedNavBar").load("./templates/navBuyer.html");
                    }else{
                        $("#includedNavBar").load("./templates/nav.html");


                    }

                    $scope.user = $scope.email;
                    console.log("what");
                    window.location.href = "/kgapp/index_" + data[i].type + ".html";
                }
            }

        }


            $scope.logout = function(){
                $scope.type = '';
                $("#includedNavBar").load("./templates/nav.html");
                $location.path('index');
            }
        console.log(pos);
        console.log(name);
            
    });

});

myApplication.controller('EditItemCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('json/Item.json').success(function (data) {
            $scope.items = data;
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

//$(function () {
//    $("#includedBuyerNavBar").load("./templates/navBuyer.html");
//});
//
//$(function () {
//    $("#includedSellerNavBar").load("./templates/navSeller.html");
//});
//
//$(function () {
//    $("#includedNavBar").load("./templates/nav.html");
//});


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
            url: '/json/upload.json'
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

myApplication.directive('ngThumb', ['$window', function($window){
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };       
        
}]);

                    
