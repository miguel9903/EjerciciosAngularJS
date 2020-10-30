angular.module("angularApp").controller('exercise4Controller', function($scope, $http, $uibModal) {

    $scope.products = [];

    // Permite conusltar el API y cargar los productos en el array products
    $scope.init = function() {
        $http.get('https://localhost:44324/api/products')
        .then(function(response){
            $scope.products  = response.data;
        }, function(response){
            console.log("HTTP request error " + response.status);
        }); 
    }

    // Permite abrir la ventana modal
    $scope.open = function (size, action, product) {   
        
        let modalTemplate = '';
   
        if (action == 'view') {
            modalTemplate = 'views/modalViewProduct.html';
        } else {
            modalTemplate = 'views/modalAddEditProduct.html';
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
                if(product){
                    return product;
                }else{
                    return "";
                }         
            }
          }
        });

        //Captura los cambios realizados en la instancia del modal
        modalInstance.result.then(function(parameter) {

            let product = parameter;
            let index = $scope.products.findIndex(p => p.ProductID == product.ProductID);
        
           if(action == "add"){
                $scope.products.push(product);
           } else if (action == "edit") {
                $scope.products[index] = product;
           } 
        });        
    };  

    // Permite hacer una peticion delete y eliminar un producto
    $scope.deleteProduct = function (product) {
        bootbox.confirm("¿Desea eliminar este producto?", function(result){ 
            if(result){
                $http.delete('https://localhost:44324/api/products/' + product.ProductID)
                .then(function(response){
                    let index = $scope.products.findIndex(p => p.ProductID == product.ProductID);
                    $scope.products.splice(index, 1);
                }, function(response){
                    console.log("HTTP request error " + response.status);
                });
            }
        });
    };

    $scope.init();
});

angular.module("angularApp").controller('modalController', function ($uibModalInstance, data, $scope, $http) {

    $scope.data = data;

    $scope.product= {
        "ProductID": $scope.data.ProductID,
        "ProductName": $scope.data.ProductName,
        "SupplierID": $scope.data.SupplierID,
        "CategoryID": $scope.data.CategoryID,
        "QuantityPerUnit": $scope.data.QuantityPerUnit,
        "UnitPrice": $scope.data.UnitPrice,
        "UnitsInStock": $scope.data.UnitsInStock,
        "UnitsOnOrder": $scope.data.UnitsOnOrder,
        "ReorderLevel": $scope.data.ReorderLevel,
        "Discontinued": $scope.data.Discontinued
    }

    // Permite hacer peticiones post y put, para agregar o editar un producto
    $scope.addEditProduct = function(){
        if($scope.product.ProductID == undefined){
            $http.post('https://localhost:44324/api/products', JSON.stringify($scope.product))
            .then(function(response){
                $uibModalInstance.close($scope.product);
            }, function(response){
                console.log("HTTP request error " + response.status);
            });
        }else{
            $http.put('https://localhost:44324/api/products/' + $scope.product.ProductID, JSON.stringify($scope.product))
            .then(function(response){
                $uibModalInstance.close($scope.product);
            }, function(response){
                console.log("HTTP request error " + response.status);
            });
        }
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});