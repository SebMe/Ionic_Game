myApp.controller('potionViewController', function ($scope, $cordovaSQLite, dataGetterSetter) {
    $scope.$on('$ionicView.enter', function () {
        dataGetterSetter.getAllExistingPotions($cordovaSQLite).then(function (values) {
            $scope.allPotions = values;
        });        
    });
})