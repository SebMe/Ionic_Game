myApp.controller('traderViewController', function ($scope, $cordovaSQLite, databaseFunctions) {

    $scope.$on('$ionicView.enter', function () {

        $scope.info = 'View betreten';
    });

    $scope.incGold = function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (values) {
            values.AmountOfGold += 100;
            $scope.info = values;
            databaseFunctions.updateAllUserData($cordovaSQLite, values);
        });
    };

});