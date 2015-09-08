myApp.controller('homeViewController', function ($scope, $cordovaSQLite, databaseFunctions) {

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
    
    $scope.incPotionAmount = function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (values) {
            values.OwnedPotions[1].Amount++;
            $scope.info = values;
            databaseFunctions.updateAllUserData($cordovaSQLite, values);
        });
    };

    $scope.addPotion = function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (values) {
            // The potion with ID 2 is not in the user.ownedPotion list, so we add id - if it were already in list we could just amount++
                var potionValues = {
                    ID: 2,
                    Rank: null,
                    Name: null,
                    Description: null,
                    Price: null,
                    Class: null,
                    ImageFilename: null,
                    Amount: 2
                };
                values.OwnedPotions.push(potionValues);
                $scope.info = values.OwnedPotions;
                databaseFunctions.updateAllUserData($cordovaSQLite, values);        
        });
    };
    
    $scope.addQuest = function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (values) {
            var quest = {
                ID: 1,
                Name: null,
                Description: null,
                Rewardmoney: null,
                Type: null,
                RewardPotions: [],
                RequiredPotions: [],
                Discoveries: []
            };
            values.SolvedQuests.push(quest);
            $scope.info = values.SolvedQuests;
            databaseFunctions.updateAllUserData($cordovaSQLite, values);
        });       
    };
});