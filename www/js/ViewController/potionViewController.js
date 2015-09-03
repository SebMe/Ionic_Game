myApp.controller('potionViewController', function ($scope) {
    $scope.$on('$ionicView.enter', function () {
        $scope.discoveredPotions = discoveredPotions;
    });
})