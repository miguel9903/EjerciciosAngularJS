angular.module("angularApp").controller("loginController", function($scope, $rootScope, $location) {

    $scope.logIn = function(){
        if($scope.password == "1234"){
            $rootScope.loginUser = true;
            $rootScope.userName = $scope.user;
            $location.path("exercise1");
        }
    }
    
});