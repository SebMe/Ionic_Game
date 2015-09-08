myApp.controller('potionViewController', function ($scope, $cordovaSQLite, databaseFunctions) {
    $scope.$on('$ionicView.enter', function () {
        databaseFunctions.getAllExistingPotions($cordovaSQLite).then(function (values) {
            $scope.allPotions = values;
        });        
    });
})