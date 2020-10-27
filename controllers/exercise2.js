angular.module("angularApp").controller('exercise2Controller', function($scope) {

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