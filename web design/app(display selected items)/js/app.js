var myApplication = angular.module('myApplication', ['ngRoute', 'angularModalService', 'angularFileUpload', "checklist-model"]);

myApplication.config(function ($routeProvider) {
    
    $routeProvider.when('/welcome', {templateUrl: 'partials/welcome.html'});
    $routeProvider.when('/all_listings', {templateUrl: 'partials/all_listings.html'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
    $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: ''});
    //$routeProvider.when('/profile/seller',{templateUrl:'partials/seller_profile.html'});
    $routeProvider.when('/profile/buyer',{templateUrl:'partials/buyer_profile.html'});
    $routeProvider.when('/add-item', {templateUrl: 'partials/add_item.html', controller: 'AddItemCtrl'}); //to add controller for addItem    
    $routeProvider.when('/faq', {templateUrl: 'partials/faq.html'});
    $routeProvider.when('/offers/seller', {templateUrl:'partials/offer_seller.html'});
    $routeProvider.when('/offers/buyer', {templateUrl:'partials/offer_buyer.html'});
    $routeProvider.when('/profile/seller/:sellerId', {templateUrl: 'partials/seller_profile.html', controller: 'SellerProfileCtrl'});
    
    //random links below
    $routeProvider.when('/register/seller', {templateUrl: 'partials/register_seller.html', controller: ''});
    $routeProvider.when('/register/buyer', {templateUrl: 'partials/register_buyer.html', controller: ''});

    $routeProvider.when('/edit-item', {templateUrl: 'partials/edit_item.html', controller: 'EditItemCtrl'}); //route according to item ID

    
    $routeProvider.when('/seller/profile/monicacheng1', {templateUrl: 'partials/seller_profile_Pending.html'});
    $routeProvider.when('/seller/profile/monicacheng2', {templateUrl: 'partials/seller_profile_sold.html'});
    $routeProvider.when('/seller/profile/monicacheng/send-offer', {templateUrl: 'partials/send_offer.html'});
    $routeProvider.when('/buyer/viewProfile/monicacheng', {templateUrl: 'partials/seller_profile_view.html', controller: 'MonicaItemListCtrl'});
    $routeProvider.when('/buyer/profile/onglyetat', {templateUrl: 'partials/buyer_profile.html'});
    $routeProvider.when('/seller/monicacheng/myoffers', {templateUrl: 'partials/offer_seller.html'});
    $routeProvider.when('/buyer/onglyetat/myoffers', {templateUrl: 'partials/offer_buyer.html'});
    $routeProvider.when('/leave-feedback', {templateUrl: 'partials/feedback.html'});
    $routeProvider.when('/send-offer', {templateUrl: 'partials/send_offer.html'});
    
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
 myApplication.controller('MainController', ['$rootScope','$scope', '$route', '$routeParams','$window',  '$location', 'NavService',
    function ($rootScope, $scope, $route, $routeParams, $window,$location, NavService) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.type = $window.sessionStorage.type;
    $scope.name = $window.sessionStorage.name;
    //$scope.loggedIn = false;
    //handle navbar
    $scope.tabs = NavService.mainTabs;

     if ($window.sessionStorage.type === 'buyer'){
         $scope.tabs = NavService.buyerTabs;
         $scope.loggedIn = true;
     }else if ($window.sessionStorage.type === 'seller'){
         $scope.tabs = NavService.sellerTabs;
         $scope.loggedIn = true;
     }else{
         $scope.loggedIn = false;
     }     
             
   $scope.logout = function(){
       $scope.loggedIn = false;
        console.log("logout success");
        $window.sessionStorage.clear();
        console.log($window.sessionStorage);
        $location.path('/');
   }
}]);

myApplication.controller('ItemListCtrl', ['$scope', '$http', '$rootScope', '$window', '$location', 'NavService',
    function ($scope, $http, $rootScope, $window, $location, NavService) {
        $scope.name =  $window.sessionStorage.name;

        console.log("All list, Name: " + $scope.name);
        console.log("All List, current user: " + $window.sessionStorage.name);
        console.log("All List, current type: " + $window.sessionStorage.type);
        $scope.items = NavService.factory.getlist();
        
        NavService.factory.getlist().then(function(data){
            $scope.items = data;

            console.log("after promise data ");
            console.log(data);
            console.log("after promise "  + $scope.items);
        });
        console.log($scope.items);
    }]);


    
myApplication.factory('NavService', function($http, $window, $q){
    var mainTabs = [{name: 'About Us', link:'#/welcome/#aboutus'},{name: 'What We Do', link:'#/welcome#whatwedo'}, {name: 'FAQ', link:'#/welcome#faq'} ];
    var sellerTabs = [{name: 'All Listings', link:'#/all_listings'}, {name: 'View Profile', link:'#profile/seller'}, {name: 'Add Item', link:'#/add-item'} , {name: 'My Offers', link:'#/offers/seller'}, {name:'FAQ', link:'#/faq'}];
    var buyerTabs = [{name: 'All Listings', link:'#/all_listings'}, {name: 'View Profile', link:'#profile/buyer'}, {name: 'My Offers', link:'#/offers/buyer'}, {name:'FAQ', link:'#/faq'}];
    var itemSellerId  = [];
    var factory = {};
    factory.getlist = function(){
        var deferred = $q.defer();  //init promise
       $http.get('json/Item.json').
        success(function(data) {
            console.log(data); //I get the correct items, all seems ok here
            for(var i = 0; i  < data.length; i++){
                itemSellerId[i] = data[i].sellerId;
            }
            console.log(itemSellerId);
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject();
        });
        return deferred.promise;
    }

    
    return {
        itemSellerId: itemSellerId,
        mainTabs: mainTabs,
        sellerTabs: sellerTabs,
        buyerTabs: buyerTabs,
        factory: factory
        }

    
});

myApplication.controller('LoginCtrl', ['$rootScope', '$scope','$http', '$location', 'NavService', '$window', function ($rootScope,$scope, $http, $location, NavService, $window) {
        console.log("You are in the login page");
        
        $scope.name = $window.sessionStorage.name;
        
        $http.get('json/users.json').success(function(data){    
            $scope.users = data;   
            var name;   
            var pos;

            $scope.name = $window.sessionStorage.name;

             var login = function(){

                    for(var i = 0; i < data.length; i++){

                        if(data[i].email == $scope.email && data[i].password == $scope.password){
                            name = data[i].name;
                            
                            
                            $window.sessionStorage.name = name;
                            $window.sessionStorage.type = data[i].type;
                            $window.sessionStorage.email = data[i].email;
                            console.log("Just logged in, Name: " + $window.sessionStorage.name);
                            console.log("Just logged in, Type: " + $window.sessionStorage.type); 
                            console.log("Just logged in, Email: " + $window.sessionStorage.email); 
                            pos = i;
                            var type = data[i].type;
                            $scope.type = type;

                            if($window.sessionStorage.type == 'seller'){
                                $scope.tabs = NavService.sellerTabs;
                            }else if ($window.sessionStorage.type == 'buyer'){
                                $scope.tabs =NavService. buyerTabs;
                            }                       
                            console.log($scope.tabs);
                            $location.path('/all_listings');
                        }
                    }
             }
        $scope.login = login;

    });         
}]);

myApplication.factory('UserService', ['$window', 'NavService', '$http', '$q', function($window, NavService, $http, $q){
    var isSeller = false;
    var sellerList = [];
    var sellerFactory = {};
    
    
    
    sellerFactory.getSellerData = function(){
        var deferred = $q.defer();  //init promise
        $http.get('json/Seller.json').
        success(function(data) {
            console.log(data); //I get the correct items, all seems ok here
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject();
        });
        return deferred.promise;
    }
    
    if ($window.sessionStorage.type === 'seller'){
        isSeller = true;
        //Check for the original lister of item with current logged in seller   
    }
        return {
            isSeller: isSeller,
            sellerList: sellerList,
            sellerFactory: sellerFactory,
        }
}]);


myApplication.controller('SellerProfileCtrl', ['$scope', '$routeParams', '$window', 'UserService', 'NavService', '$rootScope', 'ModalService', '$location', function($scope, $routeParams, $window, UserService, NavService, $rootScope, ModalService, $location){
    
    var sellerId = $routeParams.sellerId;
    $scope.sellerId = sellerId;
    var loggedInId = $window.sessionStorage.email;
    $scope.loggedInId = loggedInId;
    console.log("Seller ID: "  + sellerId);
    console.log("logged ID " + loggedInId); 
    //Check if seller is the same as the logged in id
    var isSellerLister = false;
    if(sellerId === loggedInId){
        isSellerLister = true;
    }
    $scope.isSellerLister = isSellerLister;
    var isSeller = false;
    if($window.sessionStorage.type === "seller"){
        isSeller = true;
    }
    $scope.isSeller = isSeller;
    $scope.itemsSelected = [];
    
 
    //$scope.items = NavService.factory.getlist();    
    NavService.factory.getlist().then(function(data){
        var itemList = data;
        var sellerItemList = [];
        for(var i = 0; i < itemList.length; i++){
            if(itemList[i].sellerId == sellerId){
                
                sellerItemList.push(itemList[i]);
            }        
        }
        $scope.items = sellerItemList;
        
        console.log("after promise data ");
        console.log(data);
        console.log("after promise "  + $scope.items);

    });

    var sellerDetails = [];
    UserService.sellerFactory.getSellerData().then(function(data){
        sellerDetails = data;

        $scope.sellerId = sellerId;
        $scope.loggedInId = loggedInId;
        $scope.sellerDetails = sellerDetails;
        
        console.log($scope.sellerId);
        console.log($scope.loggedInId);
        console.log($scope.sellerDetails);
        
        for(var i = 0; i < sellerDetails.length; i++){
            if(sellerId === sellerDetails[i].email){

                $scope.sellerEmail = sellerDetails[i].email;
                $scope.sellerName = sellerDetails[i].name;
                $scope.sellerMobileNumber = sellerDetails[i].mobileNumber;
                $scope.sellerAddress = sellerDetails[i].address;
                $scope.sellerPostalCode = sellerDetails[i].postalCode;
                $scope.sellerFeedbackPositive = sellerDetails[i].feedbackPositive;
                $scope.sellerFeedbackNeutral = sellerDetails[i].feedbackNeutral;
                $scope.sellerFeedbackNegative = sellerDetails[i].feedbackNegative;
                $scope.sellerProfileImage = sellerDetails[i].profileImage;
                $scope.sellerSchedule = sellerDetails[i].schedule;                
            }
        }      
        
    });
        $scope.showSeller = function () {
        ModalService.showModal({
            templateUrl: 'modalSeller.html',
            controller: "ModalCloseCtrl"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                $scope.message = "You said " + result;
            });
        });
    };
    
    $scope.itemsSelectedConfirm =  $window.sessionStorage.itemSelected;

        $scope.showBuyer = function () {
            //$scope.itemsSelected;
            var itemToConfirm = [];
            var itemNames = [];
            var allItems = $scope.itemsSelected;
            for(var i = 0; i < allItems.length; i++){
                var num = i + 1;
                var item = [];
                item.push(" " + num + ") " + allItems[i].name + ": $"+ allItems[i].price);
                itemNames.push(allItems[i].name);
                itemToConfirm.push(item);
            }
            
            $window.sessionStorage.itemSelected = itemToConfirm;
            
            console.log("in Show itemNames" + $window.sessionStorage.itemNames);
        ModalService.showModal({
            templateUrl: 'modalBuyer.html',
            //controller: "ModalCloseCtrl"
            controller: "SellerProfileCtrl"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                $scope.message = "You said " + result;
            });
        });  
    };
    
    $scope.sendOffer = function(){
        
        $location.path('/profile/seller/' + sellerId);
    };
    
        $scope.close = function (result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
        window.location.href= result; 
    };
    
    
}]);








myApplication.controller('EditItemCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('json/Item.json').success(function (data) {
            $scope.items = data;
        });

    }]);

myApplication.controller('AddItemCtrl', ['$scope', '$http','$window'    ,
    function ($scope, $http, $window) {
        
        
        //logic for retrieving items to 
        $http.get('json/monica_Items.json').success(function (data) {
            $scope.items = data;
        });
        
            $scope.addItem = function(item){
                this.item.imageURL = "./img/Items/Logitech Speakers 1.jpg";
                $scope.items.push(this.item);
            };
        
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



myApplication.controller('ModalServiceCtrl', function ($scope, ModalService, $window, $rootScope) {
    //$scope.itemsSelected = ['hello', 'hello'];
    console.log($rootScope.itemsSelected);
    $scope.itemsSelected = $rootScope.itemsSelected;
    $scope.showSeller = function () {
        ModalService.showModal({
            templateUrl: 'modalSeller.html',
            controller: "ModalCloseCtrl"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                $scope.message = "You said " + result;
            });
        });
    };
        $scope.showBuyer = function () {
        ModalService.showModal({
            templateUrl: 'modalBuyer.html',
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
        window.location.href= result; 
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

/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 */

angular.module('checklist-model', [])
.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item) {
    if (angular.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item) {
    arr = angular.isArray(arr) ? arr : [];
    for (var i = 0; i < arr.length; i++) {
      if (angular.equals(arr[i], item)) {
        return arr;
      }
    }    
    arr.push(item);
    return arr;
  }  

  // remove
  function remove(arr, item) {
    if (angular.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);

    // getter / setter for original model
    var getter = $parse(attrs.checklistModel);
    var setter = getter.assign;

    // value added to list
    var value = $parse(attrs.checklistValue)(scope.$parent);

    // watch UI checked change
    scope.$watch('checked', function(newValue, oldValue) {
      if (newValue === oldValue) { 
        return;
      } 
      var current = getter(scope.$parent);
      if (newValue === true) {
        setter(scope.$parent, add(current, value));
      } else {
        setter(scope.$parent, remove(current, value));
      }
    });

    // watch original model change
    scope.$parent.$watch(attrs.checklistModel, function(newArr, oldArr) {
      scope.checked = contains(newArr, value);
    }, true);
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {
      if (tElement[0].tagName !== 'INPUT' || !tElement.attr('type', 'checkbox')) {
        throw 'checklist-model should be applied to `input[type="checkbox"]`.';
      }

      if (!tAttrs.checklistValue) {
        throw 'You should provide `checklist-value`.';
      }

      // exclude recursion
      tElement.removeAttr('checklist-model');
      
      // local scope var storing individual checkbox model
      tElement.attr('ng-model', 'checked');

      return postLinkFn;
    }
  };
}]);

