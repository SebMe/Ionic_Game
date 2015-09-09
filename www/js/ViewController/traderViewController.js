myApp.controller('traderViewController', function ($scope, $cordovaSQLite, $cordovaNativeAudio, $timeout, databaseFunctions) {
    $scope.$on('$ionicView.enter', function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            // Preload sounds that can be used in the view
            $cordovaNativeAudio.preloadSimple('moneySound', 'sounds/money.mp3')

            $scope.userAmountOfGold = user.AmountOfGold;
        });
        
    });

    $scope.showPotionsToBuy = function () {
        databaseFunctions.getAllExistingPotions($cordovaSQLite).then(function (allPotions) {
            $scope.listOfPotions = allPotions;
            $scope.action = 'buy';
        });
    };

    $scope.showAllUserpotions = function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            $scope.listOfPotions = user.OwnedPotions;
            $scope.action = 'sell';
        });
    };
    
    $scope.processPotion = function (potion) {
        if ($scope.action == 'buy') {
            $scope.buyPotion(potion);
        } else {
            $scope.sellPotion(potion);
        };
    }

    $scope.buyPotion = function (potion) {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            // Potion retrieved from the Potions_Table has no Amount field, need to add Amount since a potion the user possesses has an Amount
            potion.Amount = 1;
            if (user.AmountOfGold - potion.Price >= 0) {
                if (typeof user.OwnedPotions != 'undefined') { // If the user has no potions, the OwnedPotions field does not exist and is 'undefined'                 
                    var addedPotion = false;
                    // Check all potions the user has, if found increase amount
                    for (var i = 0; i < user.OwnedPotions.length; i++) {
                        if (potion.ID == user.OwnedPotions[i].ID) {                          
                            user.OwnedPotions[i].Amount++;
                            user.AmountOfGold -= potion.Price;
                            addedPotion = true;
                        };                       
                    };
                    // User didnt have the potion yet, add it
                    if (addedPotion == false) {
                        user.OwnedPotions.push(potion);
                        user.AmountOfGold -= potion.Price;
                    };
                // User had no potions, OwnedPotions field was not defined
                } else {
                    user.OwnedPotions = [];
                    user.OwnedPotions.push(potion);
                    user.AmountOfGold -= potion.Price;
                };

                $scope.traderImage = 'TraderReaction.png'
                $timeout(function () {
                    $scope.traderImage = 'Trader.png';
                }, 500);
            };
            $scope.userAmountOfGold = user.AmountOfGold;
            databaseFunctions.updateAllUserData($cordovaSQLite, user);
        });      
    };

    $scope.sellPotion = function (potion) {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            if (typeof user.OwnedPotions != 'undefined') { // If the user has no potions, the OwnedPotions field does not exist and is 'undefined'
                for (var i = 0; i < user.OwnedPotions.length; i++) {
                    if (potion.ID == user.OwnedPotions[i].ID && user.OwnedPotions[i].Amount > 0) {
                        user.OwnedPotions[i].Amount--;
                        user.AmountOfGold += potion.Price;
                        // Play a Money Sound (is native, so has to be commented out for app to still work while pc-testing in chrome)
                        $cordovaNativeAudio.play('moneySound');
                        $scope.traderImage = 'TraderReaction.png'
                        $timeout(function () {
                            $scope.traderImage = 'Trader.png';
                        }, 500);                       
                    };
                };
                $scope.userAmountOfGold = user.AmountOfGold;
                $scope.listOfPotions = user.OwnedPotions;
                databaseFunctions.updateAllUserData($cordovaSQLite, user);
            };
        });
    };

});