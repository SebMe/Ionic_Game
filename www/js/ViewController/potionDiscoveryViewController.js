myApp.controller('potionDiscoveryViewController', function ($scope, $interval, $timeout, $cordovaSQLite, databaseFunctions) {

    // This function is called by an on-click event in the potionDiscoveryView
    var touchCounter = 0;
    $scope.touchDiscovery = function () {
        // Potion of Touch    
        touchCounter++;
        if (touchCounter >= 5) {
            databaseFunctions.getAllExistingPotions($cordovaSQLite).then(function (potions) {
                var chosenArrayPosition = Math.round(Math.random() * 100) % potions.length;
                var selectedPotion = potions[chosenArrayPosition];
                selectedPotion.Amount = 1;  // Potions from the Potion_Table have no Amount field, but is needed if added via user.OwnedPotions.push(selectedPotion)
                $scope.displayPotion = selectedPotion;

                databaseFunctions.getUser($cordovaSQLite).then(function (user) {
                    // If the user has no potions, the OwnedPotions field wont exist and equal 'undefined'
                    if (typeof user.OwnedPotions != 'undefined') {                     
                        for (var i = 0; i < user.OwnedPotions.length; i++) {
                            if (user.OwnedPotions[i].ID == selectedPotion.ID) {
                                user.OwnedPotions[i].Amount++;
                            };
                        };
                        // User had no potions
                    } else {
                        user.OwnedPotions = [];
                        user.OwnedPotions.push(selectedPotion);
                    };
                   
                    databaseFunctions.updateAllUserData($cordovaSQLite, user);

                    // After 1500 ms remove the image
                    $timeout(function () {
                        $scope.displayPotion = null;
                    }, 1500);
                });               
            });
            touchCounter = 0;
        }
    };


    // This function is called when the potionDiscoveryView is opened
    $scope.$on('$ionicView.enter', function () {
        // Init
        var newlyDiscoveredPotions = [];
        touchCounter = 0; // This can be increased by clicks, when >= 5 PotionOfTouch is discovered (see potionOfTouchIsDiscoveredFunction)
        /*
        // Potion of Beginning    
        var potionOfBeginningDiscovered = window.localStorage[PotionOfBeginning.name];
        if (potionOfBeginningDiscovered != 'true') {
            discoveredPotions.push(PotionOfBeginning);
            newlyDiscoveredPotions.push(PotionOfBeginning);
            window.localStorage[PotionOfBeginning.name] = 'true';
        }

        // Potion Of Day 
        var potionOfDayDiscovered = window.localStorage[PotionOfDay.name];
        var currentHour = (new Date).getHours();
        var itIsDaytime = currentHour >= 8 && currentHour <= 20;
        if (itIsDaytime && potionOfDayDiscovered != 'true') {
            newlyDiscoveredPotions.push(PotionOfDay);
            discoveredPotions.push(PotionOfDay);
            window.localStorage[PotionOfDay.name] = 'true';
        }


        // Show the newly discovered potions
        var index = 0;
        $scope.potion = newlyDiscoveredPotions[index];
        var showNewlyDiscoveredPotions = $interval(function (index) {
            if (index+1 < newlyDiscoveredPotions.length) {
                $scope.potion = newlyDiscoveredPotions[index+1];
            } else {
                $scope.potion = null; // After the last discovered potion is shown the screen will be empty again (no potion displayed)
                $interval.cancel(showNewlyDiscoveredPotions);
            }
        }, 1500);
        */
    });
});