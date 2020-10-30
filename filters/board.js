/*  Este filtro permite pintar la letra correspondiente
    segun sea el valor de cada posicion de la matriz
    del juego: 0 --> '', 1 --> 'X', 2 --> 'O' */

angular.module("angularApp").filter('showBoard', function(){
    return function(num){
        if (num == 1)
            return "X";
        else if (num == 2)
            return "O"
        else
            return "";
    }
});