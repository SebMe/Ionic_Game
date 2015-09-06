myApp.controller('questViewController', function ($scope, $cordovaSQLite, dataGetterSetter) {
    $scope.$on('$ionicView.enter', function () {
        dataGetterSetter.getAllExistingQuests($cordovaSQLite).then(function (values) {
            $scope.allQuests = values;
        });
    });
})