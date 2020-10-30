angular.module("angularApp").controller('exercise5Controller', function($scope, $http, $rootScope, $interval) {

    $scope.idJuego = ""
    $scope.jugador1 = "";
    $scope.jugador2 = "";
    $scope.existeGanador = false;
    $scope.nombreJugador = $rootScope.userName;
    $scope.nombreGanador = "No hay ganador";
    $scope.turnoActual = "";
    $scope.juegoIniciado = false;
    $scope.jugadaGanadora = [];
    $scope.tipoJugadaGanadora = "";
    $scope.board = [[], [], []]; 
    $scope.disableBoard = true;

    /* Permite hacer una peticion post para crear un nuevo juego o unir 
    al jugador a uno ya existente */
    $scope.startGame = function(){
        $scope.juegoIniciado = true;
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
    
    /* Pwemite consultar cada 2s si se ha unido el jugador 2. De ser asi, 
       se llama a otro método que consulta el estado del juego cada 2s*/
    $scope.joinPlayers = function(){ 
        var interval = $interval(function () {
            $http.get('https://localhost:44374/api/triqui/' + $scope.idJuego)
            .then(function(response){

                $scope.jugador1 = response.data.Jugador1;
                $scope.jugador2 = response.data.Jugador2;

                if($scope.jugador2 != ""){
                    $interval.cancel(interval);
                    $scope.checkGameStatus(); 
                }

            }, function(response){
                console.log("HTTP request error " + response.status);
            });
        }, 2000);
    }

    /* Permite consultar el estado del juego cada 2s, para verificar si han habido
    cambios en el tablero, en el turno o si existe un ganador*/
    $scope.checkGameStatus = function(){ 
        var interval = $interval(function () {
            $http.get('https://localhost:44374/api/triqui/' + $scope.idJuego)
            .then(function(response){

                $scope.board = response.data.Matriz;
                $scope.turnoActual = response.data.Turno;

                if(response.data.Ganador != 0){ s
                    $scope.existeGanador = true;
                    $scope.nombreGanador = "Jugador " + response.data.Ganador;
                }
                         
                $scope.disabledBoard(); 

                if($scope.existeGanador){
                    $interval.cancel(interval);
                }

            }, function(response){
                console.log("HTTP request error " + response.status);
            }); 
        }, 2000);
    }

    /* Permite realizar una jugada, modificando la matriz del juego actual, mediante 
    el envio de una jugada */
    $scope.play = function(fila, columna){ 
        let jugada = {
            "fila": fila,
            "columna": columna
        }
        if($scope.existeGanador == false){
            $http.post('https://localhost:44374/api/triqui/' + $scope.idJuego, JSON.stringify(jugada))
            .then(function(response){

                $scope.board = response.data.Matriz;
                if(response.data.Ganador != 0){
                    $scope.existeGanador = true;
                    $scope.nombreGanador = "Jugador " + response.data.Ganador;
                    $scope.jugadaGanadora = response.data.JugadaGanadora;
                    $scope.tipoJugadaGanadora = response.data.TipoJugadaGanadora;
                }

            }, function(response){
                console.log("HTTP request error " + response.status);
            });
        }
    }

    /* Permite habilitar o inhabilitar el tablero dependiendo del 
    turno actual y el jugador */
    $scope.disabledBoard = function(){
        if($scope.nombreJugador == response.data.Jugador1){ 
            if(response.data.Turno == 2){
                $scope.disableBoard = true;
            }else{
                $scope.disableBoard = false;
            }
        }else if($scope.nombreJugador == response.data.Jugador2){
            if(response.data.Turno == 1){
                $scope.disableBoard = true;
            }else{
                $scope.disableBoard = false;
            }
        } 
    }

    /* Permite comprobar si existe ganador, en cuyo caso, se devuelve el nombre 
        de la clase correspondiente para que se pinte en cada boton, la jugada ganadora*/
    $scope.checkWinner = function(fila, columna){
        let clase = "";
        if($scope.tipoJugadaGanadora != ""){
            for(let i = 0; i < 3; i++){
                if($scope.jugadaGanadora[i][0] == fila && $scope.jugadaGanadora[i][1] == columna){
                    if ($scope.tipoJugadaGanadora == "Horizontal") {
                        clase = "ganador_horizontal";
                    } else if ($scope.tipoJugadaGanadora  == "Vertical") {
                        clase = "ganador_vertical";
                    } else if ($scope.tipoJugadaGanadora  == "Diagonal") {
                        clase = "ganador_diagonal_inversa";
                    } else {
                        clase = "ganador_diagonal";
                    }
                }
            }         
        }
        return clase;
    }

    $scope.clearBoard = function(){
        $scope.existeGanador = false;
    } 
}); 