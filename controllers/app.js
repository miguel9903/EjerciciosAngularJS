var app = angular.module("angularApp", ["ngRoute", "ui.bootstrap"]);

// Routing
app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl : "views/login.html",
        controller : "loginController"
    }).when("/exercise1", {
        templateUrl : "views/exercise1.html",
        controller : "exercise1Controller"
    }).when("/exercise2", {
        templateUrl : "views/exercise2.html",
        controller : "exercise2Controller"
    }).when("/exercise3", {
        templateUrl : "views/exercise3.html",
        controller : "exercise3Controller" 
    }).when("/exercise4", {
        templateUrl : "views/exercise4.html",
        controller : "exercise4Controller" 
    }).when("/exercise5", {
        templateUrl : "views/exercise5.html",
        controller : "exercise5Controller" 
    }).otherwise({
        redirectTo : "/"
    });
  });

app.controller("appController", function($scope, $rootScope) {

    $rootScope.loginUser = false;
    $rootScope.userName = "";
    
    $scope.logOut = function(){
        $rootScope.loginUser = false; 
    }
});
