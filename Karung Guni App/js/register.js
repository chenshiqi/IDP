(function () {
    var app = angular.module('register', []);
    
    app.controller('RegisterController', function () {
         this.users = userbuyer;
    });
    
    var userbuyer = [
        name: '',
        email: '',
        password: '',
        address: '',
        postalcode: '',
        contact: '',
        gender: '',
        profilepic: '',
        tnc: '',
    ];
    
    var userseller = [
        name: '',
        email: '',
        password: '',
        address: '',
        postalcode: '',
        contact: '',
        gender: '',
        profilepic: '',
        tnc: '',
    ];
    
})()；