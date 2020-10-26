var app = angular.module("angularApp", ["ngRoute", "ui.bootstrap"]);

// Routing
app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl : "pages/login.html",
        controller : "loginController"
    }).when("/exercise1", {
        templateUrl : "pages/exercise1.html",
        controller : "exercise1Controller"
    }).when("/exercise2", {
        templateUrl : "pages/exercise2.html",
        controller : "exercise2Controller"
    }).when("/exercise3", {
        templateUrl : "pages/exercise3.html",
        controller : "exercise3Controller" 
    }).when("/exercise4", {
        templateUrl : "pages/exercise4.html",
        controller : "exercise4Controller" 
    }).when("/exercise5", {
        templateUrl : "pages/exercise5.html",
        controller : "exercise5Controller" 
    }).otherwise({
        redirectTo : "/"
    });
  });

// Controllers
app.controller("appController", function($scope, $rootScope) {
    $rootScope.loginUser = false;
    $rootScope.userName = "";
    $scope.logOut = function(){
        $rootScope.loginUser = false; 
    }
});

app.controller("loginController", function($scope, $rootScope, $location) {
    $scope.logIn = function(){
        if($scope.password == "1234"){
            $rootScope.loginUser = true;
            $rootScope.userName = $scope.user;
            $location.path("exercise1");
        }
    }
});

app.controller('exercise1Controller', function($scope) {

    $scope.player1 = "Unselected";
    $scope.player2 = "Unselected";
    $scope.winner = "Not winner";

    $scope.playPlayer1 = function(opc, e) {
        $scope.player1 = opc;
        e.target.parentElement.classList.add("selected");
    }

    $scope.playPlayer2 = function(opc, e) {
        $scope.player2 = opc;
        e.target.parentElement.classList.add("selected");
    }

    $scope.getWinner = function() {
        if ($scope.player1 != "Unselected" && $scope.player2 != "Unselected") {
            if ($scope.player1 == $scope.player2) {
                $scope.winner = "Tied game";
            } else if ($scope.player1 == "Scissors" && ($scope.player2 == "Paper" || $scope.player2 == "Lizard")) {
                $scope.winner = "Player 1";
            } else  if ($scope.player1 == "Paper" && ($scope.player2== "Rock" || $scope.player2 == "Spock") ){
                $scope.winner = "Player 1";
            } else  if ($scope.player1 == "Rock" && ($scope.player2 == "Lizard" || $scope.player2 == "Scissors")) {
                $scope.winner = "Player 1";
            } else  if ($scope.player1 == "Lizard" && ($scope.player2 == "Spock" || $scope.player2 == "Paper")) {
                $scope.winner = "Player 1";
            } else  if ($scope.player1 == "Spock" && ($scope.player2 == "Scissors" || $scope.player2 == "Rock")) {
                $scope.winner = "Player 1";
            } else {
                $scope.winner = "Player 2";
            }
        }
    }
});

app.controller('exercise2Controller', function($scope) {

    $scope.numbers = [];
    $scope.min = 0;
    $scope.max = 0;
    $scope.nValue = 0;

    $scope.addArrayValues = function() {
        for (let i = 0; i < $scope.nValue; i++) {
            let num = parseInt(prompt(`Enter number ${i+1}`));
            while (isNaN(num)) {
                num = parseInt(prompt(`Enter a numeric value. Enter number ${i+1}`));
            }
            $scope.numbers.push(num);
        }

        let sums = [];
        for (let index in $scope.numbers) {
            sums.push($scope.calculateSum(index));
        };
        
        if (sums.length > 0) {
            $scope.min = Math.min(...sums);
            $scope.max = Math.max(...sums);
        }
    }

    $scope.calculateSum = function(numberIndex) {
        let sum = 0;
        $scope.numbers.forEach((number, index) => {
            if (index != numberIndex) {
                sum += number;
            } 
        });
        return sum;
    }

    $scope.showArray = function() {
        if ($scope.numbers.length > 0) {
            return $scope.numbers.join(",");
        } else {
            return "No values have been entered";
        }
    }

    $scope.emptyData = function(){
        $scope.numbers.splice(0, $scope.numbers.length);
        $scope.min = 0;
        $scope.max = 0;
    }
});

app.controller('exercise3Controller', function($scope, $http, $uibModal) {

    $scope.products = [];

    $http.get('https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json')
    .then(function(response){
        $scope.products  = response.data.value;
    }, function(response){
        console.log("HTTP request error " + response.status);
    });

    $scope.open = function (size, productID) {      
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'pages/modalViewProduct.html',
          controller: 'modalController',
          size: size,
          resolve: {
            data: function () {
              return $scope.products[productID-1];
            }
          }
        });
    };  
});

app.controller('exercise4Controller', function($scope, $http, $uibModal) {

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
            modalTemplate = 'pages/modalViewProduct.html';
        } else if (action == 'edit') {
            modalTemplate = 'pages/modalEditProduct.html';
        } else if (action == 'add') {
            modalTemplate = 'pages/modalAddProduct.html';
        } else {
            modalTemplate = 'pages/modalDeleteProduct.html';
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
app.controller('modalController', function ($uibModalInstance, data, $scope, $http) {

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
        location.reload();
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
        location.reload();
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
        location.reload();
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('exercise5Controller', function($scope, $http, $rootScope) {

    $scope.idJuego = ""
    $scope.jugador1 = "";
    $scope.jugador2 = "";
    $scope.existeGanador = false;
    $scope.nombreJugador = $rootScope.userName;
    $scope.nombreGanador = "No hay ganador";
    $scope.turnoActual = "";
    var msEspera = document.getElementById("msEspera");

    $scope.board = [[], [], []]; //Tablero de divs del juego
    let num = 0;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            $scope.board[i][j] = document.getElementById("button" + num);
            num++;
        }
    }

    $scope.disableBoard = function(value = true){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(value){
                    $scope.board[i][j].setAttribute("disabled", "");
                }else{
                    $scope.board[i][j].removeAttribute("disabled");
                }
            }
        }
    }

    $scope.disableBoard();

    $scope.startGame = function(){ // Crea un nuevo juego o une al jugador a uno ya existente
        $http.post('https://localhost:44374/api/triqui/', JSON.stringify($scope.nombreJugador))
        .then(function(response) { 

            $scope.idJuego = response.data.Id;
            $scope.jugador1 = response.data.Jugador1;
            $scope.jugador2 = response.data.Jugador2;
            $scope.turnoActual = response.data.Turno;
            $scope.joinPlayers();

        }, function(response){
            console.log("HTTP request error " + response.status);
        }); 
    }

    $scope.joinPlayers = function(){ // Comprueba cada 2 seg si hay jugador2
        let interval = setInterval(() => {
            $http.get('https://localhost:44374/api/triqui/' + $scope.idJuego)
            .then(function(response){
     
                $scope.jugador1 = response.data.Jugador1;
                $scope.jugador2 = response.data.Jugador2;

                if($scope.jugador2 == ""){
                    console.log("Esperando a que se conecte el otro jugador...");
                    msEspera.textContent = "Esperando a que se conecte el otro jugador..."; 
                }else{
                    console.log("Jugadores conectados.");
                    msEspera.textContent = "Jugadores conectados";
                    clearInterval(interval);   
                    $scope.checkGameStatus(); 
                } 
              
            }, function(response){
                console.log("HTTP request error " + response.status);
            }); 
        }, 1000);
    }

    $scope.checkGameStatus = function(){ // Consulta cada 2s el estado del juego
        let interval = setInterval(() => {
            $http.get('https://localhost:44374/api/triqui/' + $scope.idJuego)
            .then(function(response){  

                $scope.printBoard(response.data.Matriz); //Vuelve a pintar el tablero
                $scope.turnoActual = response.data.Turno; // Actualiza el turno actual
                if(response.data.Ganador != 0){ // Verifica si hay ganador
                    $scope.existeGanador = true;
                    $scope.nombreGanador = "Jugador " + response.data.Ganador;
                    $scope.printBoardWinner(response.data.JugadaGanadora, response.data.TipoJugadaGanadora);
                    msEspera.textContent = "";
                }

                if($scope.nombreJugador == response.data.Jugador1){ // Habilita o deshabilita el tablero
                    if(response.data.Turno == 2){
                        $scope.disableBoard();
                        msEspera.innerHTML = 'Esperando al jugador 2...';
                    }else{
                        $scope.disableBoard(false);
                        msEspera.innerHTML = '';
                    }
                }else if($scope.nombreJugador == response.data.Jugador2){
                    if(response.data.Turno == 1){
                        $scope.disableBoard();
                        msEspera.innerHTML = 'Esperando al jugador 1...';
                    }else{
                        $scope.disableBoard(false);
                        msEspera.innerHTML = '';
                    }
                } 

                if($scope.existeGanador){
                    clearInterval(interval);
                    $scope.existeGanador = false;
                }

            }, function(response){
                console.log("HTTP request error " + response.status);
            });
        }, 2000);
    }

    $scope.play = function(fila, columna){ // Realiza la jugada
        let jugada = {
            "fila": fila,
            "columna": columna
        }
        if($scope.existeGanador == false){
            $http.post('https://localhost:44374/api/triqui/' + $scope.idJuego, JSON.stringify(jugada))
            .then(function(response){
                $scope.printBoard(response.data.Matriz);
                if(response.data.Ganador != 0){
                    $scope.existeGanador = true;
                    $scope.nombreGanador = "Jugador " + response.data.Ganador;
                    $scope.printBoardWinner(response.data.JugadaGanadora, response.data.TipoJugadaGanadora);
                }
            }, function(response){
                console.log("HTTP request error " + response.status);
            });
        }
    }

    $scope.printBoard = function(matriz){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(matriz[i][j] == 1){
                    $scope.board[i][j].innerHTML = "X";
                }else if(matriz[i][j] == 2){
                    $scope.board[i][j].innerHTML = "O";
                }else{
                    $scope.board[i][j].innerHTML = "";
                }
            }
        }
    } 

    $scope.clearBoard = function(){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                $scope.existeGanador = false;
                $scope.board[i][j].innerHTML = "";
                $scope.board[i][j].style.background = "none";
            }
        }
    } 

    $scope.printBoardWinner = function(matriz, tipoJugada){
        for(let i = 0; i < 3; i++){
            if (tipoJugada == "Horizontal") {
                $scope.board[matriz[i][0]][matriz[i][1]].style.backgroundImage = "url('img/linea_horizontal.png')";
                $scope.board[matriz[i][0]][matriz[i][1]].style.backgroundSize = "cover"; 
            } else if (tipoJugada == "Vertical") {
                $scope.board[matriz[i][0]][matriz[i][1]].style.backgroundImage = "url('img/linea_vertical.png')";
                $scope.board[matriz[i][0]][matriz[i][1]].style.backgroundSize = "cover"; 
            } else if (tipoJugada == "Diagonal") {
                $scope.board[matriz[i][0]][matriz[i][1]].style.backgroundImage = "url('img/linea_diagonal_inversa.png')";
                $scope.board[matriz[i][0]][matriz[i][1]].style.backgroundSize = "cover"; 
            } else {
                $scope.board[matriz[i][0]][matriz[i][1]].style.backgroundImage = "url('img/linea_diagonal.png')";
                $scope.board[matriz[i][0]][matriz[i][1]].style.backgroundSize = "cover"; 
            }
        }
    }  
});


