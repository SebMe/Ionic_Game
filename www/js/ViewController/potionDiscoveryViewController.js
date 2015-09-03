myApp.controller('potionDiscoveryViewController', function ($scope, $interval, $timeout) {

    // This function is called by an on-click event in the potionDiscoveryView
    var touchCounter = 0;
    $scope.potionOfTouchIsDiscoveredFunction = function () {
        // Potion of Touch    
        touchCounter++;
        var potionOfTouchDiscovered = window.localStorage[PotionOfTouch.name];
        if (potionOfTouchDiscovered != 'true' && touchCounter >= 5) {
            discoveredPotions.push(PotionOfTouch);
            $scope.potion = PotionOfTouch;
            window.localStorage[PotionOfTouch.name] = 'true';

            // After 1500 ms remove the PotionOfTouch image
            $timeout(function () {
                $scope.potion = null;
            }, 1500);
            touchCounter = 0;
        }
    };


    // This function is called when the potionDiscoveryView is opened
    $scope.$on('$ionicView.enter', function () {
        // Init
        var newlyDiscoveredPotions = [];
        touchCounter = 0; // This can be increased by clicks, when >= 5 PotionOfTouch is discovered (see potionOfTouchIsDiscoveredFunction)

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
    });
});