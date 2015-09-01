myApp.controller('homeViewController', function ($scope) {
    $scope.$on('$ionicView.enter', function () {
        $scope.potions = potions;
        $scope.discoveredPotions = discoveredPotions;

        // Debug purposes only
        window.localStorage[PotionOfDay.name] = 'false';
        window.localStorage[PotionOfBeginning.name] = 'false';
        discoveredPotions = [];
    });
})