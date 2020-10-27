angular.module("angularApp").controller('exercise5Controller', function($scope, $http, $rootScope) {

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