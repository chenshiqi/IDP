var myApp = angular.module('starter.services', ['firebase']);

myApp.factory('MasterDataService', function ($firebase) {
    var firebaseRef = new Firebase("https://blinding-heat-6498.firebaseio.com/users");
    var sync = $firebase(firebaseRef);
    var allUsersArray = sync.$asArray();

    // store the user logged in
    var loggedInUser = JSON.parse(window.localStorage['userSession'] || '{}');

    // create user success?
    var createNewUserSuccess = "";

    // methods for getting data
    return {
        allUsers: function () {
            return allUsersArray;
        }       
    };
});

