myApp.controller('questViewController', function ($scope, $cordovaSQLite, databaseFunctions) {
    $scope.$on('$ionicView.enter', function () {
        databaseFunctions.getAllExistingQuests($cordovaSQLite).then(function (values) {
            $scope.allQuests = values;
        });
    });
})