angular.module("angularApp").controller('exercise1Controller', function($scope) {

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