myApp.controller('homeViewController', function ($scope, $cordovaSQLite, dataGetterSetter) {

    $scope.$on('$ionicView.enter', function () {
        $scope.potions = potions;
        $scope.discoveredPotions = discoveredPotions;
    });

    $scope.insert = function () {
        databaseInit.create($cordovaSQLite);
        databaseInit.fill($cordovaSQLite);
    };
    
    $scope.select = function () {

        /*var q = $q.defer()
         q.resolve('bla');
         return q.promise;*/

        dataGetterSetter.getAllExistingQuests($cordovaSQLite).then(function (values) {
            var test = values;
            test[0].Rewardmoney = 50;
            $scope.info = test[0];
        });
    };
});