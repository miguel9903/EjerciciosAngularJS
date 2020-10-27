angular.module("angularApp").controller('exercise4Controller', function($scope, $http, $uibModal) {

    $scope.products = [];
   
    $http.get('https://localhost:44324/api/products')
    .then(function(response){
        $scope.products  = response.data;
    }, function(response){
        console.log("HTTP request error " + response.status);
    }); 

    $scope.open = function (size, action, productID = '') {   

        let modalTemplate = '';
   
        if (action == 'view') {
            modalTemplate = 'views/modalViewProduct.html';
        } else if (action == 'edit') {
            modalTemplate = 'views/modalEditProduct.html';
        } else if (action == 'add') {
            modalTemplate = 'views/modalAddProduct.html';
        } else {
            modalTemplate = 'views/modalDeleteProduct.html';
        }

        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: modalTemplate,
          controller: 'modalController',
          size: size,
          resolve: {
            data: function () {
              let product = 'Not data';
              if (productID != ''){
                  product = $scope.products.filter(p => p.ProductID == productID);
                  return product[0];
              }
              return product;
            }
          }
        });
    };  
});

// View and delete product
angular.module("angularApp").controller('modalController', function ($uibModalInstance, data, $scope, $http) {

    $scope.data = data;

    $scope.productAdd = {
        "ProductName": "",
        "SupplierID": "",
        "CategoryID": "",
        "QuantityPerUnit": "",
        "UnitPrice": "",
        "UnitsInStock": "",
        "UnitsOnOrder": "",
        "ReorderLevel": "",
        "Discontinued": true
    }

    $scope.productEdit = {
        "ProductName": data.ProductName,
        "SupplierID": data.SupplierID,
        "CategoryID": data.CategoryID,
        "QuantityPerUnit": data.QuantityPerUnit,
        "UnitPrice": data.UnitPrice,
        "UnitsInStock": data.UnitsInStock,
        "UnitsOnOrder": data.UnitsOnOrder,
        "ReorderLevel": data.ReorderLevel,
        "Discontinued": data.Discontinued
    }

    // Add product
    $scope.addProduct = function () {
        console.log($scope.productAdd);
        $http.post('https://localhost:44324/api/products', JSON.stringify($scope.productAdd))
        .then(function(response){
            console.log(response.status);
        }, function(response){
            console.log("HTTP request error " + response.status);
        });
        $uibModalInstance.close();
        //location.reload();
    };
    
    // Edit product
    $scope.editProduct = function (productID) {
        console.log($scope.productEdit);
        console.log(productID);
        $http.put('https://localhost:44324/api/products/' + productID, JSON.stringify($scope.productEdit))
        .then(function(response){
            console.log(response.status);
        }, function(response){
            console.log("HTTP request error " + response.status);
        });
        $uibModalInstance.close();
        //location.reload();
    };

    //Delete product
    $scope.deleteProduct = function (productID) {
        $http.delete('https://localhost:44324/api/products/' + productID)
        .then(function(response){
            console.log(response.status);
        }, function(response){
            console.log("HTTP request error " + response.status);
        });
        $uibModalInstance.close();
        //location.reload();
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});