angular.module("angularApp").controller('exercise3Controller', function($scope, $http, $uibModal) {

    $scope.products = [];

    // Permite conusltar el API y cargar los productos en el array products
    $scope.init = function() {
        $http.get('https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json')
        .then(function(response){
            $scope.products  = response.data.value;
        }, function(response){
            console.log("HTTP request error " + response.status);
        });
    }

    // Permite abrir la ventana modal
    $scope.open = function (size, productID) {      
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'views/modalViewProduct.html',
          controller: 'modalController',
          size: size,
          resolve: {
            data: function () {
              return $scope.products[productID-1];
            }
          }
        });
    };  

    $scope.init();

});

angular.module("angularApp").controller('modalController', function ($uibModalInstance, data, $scope, $http) {
    $scope.data = data;
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});