myApp.controller('potionDiscoveryViewController', function ($scope, $interval, $timeout, $cordovaSQLite, databaseFunctions) {

    // Will return 'undefined' if the discovery is not yet found or is found but has no discoveryData
    var getDiscoveryDataForUserDiscovery = function (discoveryName, user) {
        for (var i = 0; i < user.DataForDiscoveries.length; i++) {
            if (user.DataForDiscoveries[i].Name == discoveryName) {
                return user.DataForDiscoveries[i].DiscoveryData;
            };
        };
    };

    var setDiscoveryDataForUserDiscovery = function (discoveryName, user, discoveryData) {
        var dataAdded = false;
        for (var i = 0; i < user.DataForDiscoveries.length; i++) {
            if (user.DataForDiscoveries[i].Name == discoveryName) {
                user.DataForDiscoveries[i].DiscoveryData = discoveryData;
                dataAdded = true;
                databaseFunctions.updateAllUserData($cordovaSQLite, user);
            };
        };

        // User had no existing data for this discovery, add a new entry
        if (dataAdded == false) {
            databaseFunctions.getAllExistingDiscoveries($cordovaSQLite).then(function (allExistingDiscoveries) {
                for (var i = 0; i < allExistingDiscoveries.length; i++) {
                    if (allExistingDiscoveries[i].Name == discoveryName) {
                        allExistingDiscoveries[i].DiscoveryData = discoveryData;
                        user.DataForDiscoveries = [];
                        user.DataForDiscoveries.push(allExistingDiscoveries[i]);
                        databaseFunctions.updateAllUserData($cordovaSQLite, user);
                    };
                };
            });
        };
    };

    // Returns -1 if the user did not found this discovery yet, 0 if he has found it and its ready, else the number of minutes till its available again
    var getDiscoveryCooldownInMinutesForUser = function (discoveryName, user) {
        for (var i = 0; i < user.FoundDiscoveries.length; i++) {
            if (user.FoundDiscoveries[i].Name == discoveryName) {
                var millisecondsTillAvailable = user.FoundDiscoveries[i].AvailabilityDate - (new Date).getTime();
                var minutesTillAvailable = Math.round(millisecondsTillAvailable / (1000 * 60));
                var minutesTillAvailableReducedByItems = minutesTillAvailable - Math.round(minutesTillAvailable * user.DiscoveryCDReductionPercentage / 100);
                if (minutesTillAvailableReducedByItems < 0) {
                    return 0;
                } else {
                    return  minutesTillAvailableReducedByItems
                };
            };
        };
        // Discovery was not found by the user yet
        return -1;
    };

    var rewardUser = function (user) {
        // Set the reward in the user structure
        databaseFunctions.getAllExistingPotions($cordovaSQLite).then(function (potions) {
            var chosenArrayPosition = Math.round(Math.random() * 100) % potions.length;
            var selectedPotion = potions[chosenArrayPosition];
            selectedPotion.Amount = 1;  // Potions from the Potion_Table have no Amount field, but is needed if added via user.OwnedPotions.push(selectedPotion)

            var potionAdded = false;
            for (var i = 0; i < user.OwnedPotions.length; i++) {
                if (user.OwnedPotions[i].ID == selectedPotion.ID) {
                    user.OwnedPotions[i].Amount++;
                    potionAdded = true;
                };
            };
            // User had no amount of the reward potion, so we add a new entry now
            if (potionAdded == false) {
                user.OwnedPotions.push(selectedPotion);
            }			

			var discoveryGoldReward = 3000;
			var totalRewardMoney = discoveryGoldReward + user.ExtraGoldOnDiscovery;
			user.AmountOfGold += totalRewardMoney
			$scope.bonusGold = totalRewardMoney;
			$scope.goldImageFilename = 'Gold.png';
			$scope.displayPotion = selectedPotion;
			
            databaseFunctions.updateAllUserData($cordovaSQLite, user);

            // After 1500 ms remove the reward images
            $timeout(function () {
                $scope.displayPotion = null;
				$scope.bonusGold = null;
				$scope.goldImageFilename = null;
            }, 1500);

        });
    };

    var displayDiscoveryOnCooldown = function(discoveryName, minutesTillAvailable){
        $scope.cooldown = discoveryName + ' available in: ' + minutesTillAvailable + " minutes";
        // After 1500 ms remove the info
        $timeout(function () {
            $scope.cooldown = null;
        }, 1500);
        touchCounter = 0;
    };

    var displayDiscoveryName = function (discoveryName) {
        // Display reward potion
        $scope.discoveryName = discoveryName;

        // After 1500 ms remove the image
        $timeout(function () {
            $scope.discoveryName = null;
        }, 1500);
    }

    var resetCooldownOnDiscoveryForUser = function (discoveryName, user) {
        var currentDateInMS = (new Date).getTime();
        var oneHourInMS = (1000 * 60 * 60);
        for (var i = 0; i < user.FoundDiscoveries.length; i++) {
            if (user.FoundDiscoveries[i].Name == discoveryName) {
                user.FoundDiscoveries[i].AvailabilityDate = currentDateInMS + oneHourInMS;
            };
        };
    };

    var setDiscoveryAsFoundForUser = function (discoveryName, user) {
        var currentDateInMS = (new Date).getTime();
        var oneHourInMS = (1000 * 60 * 60);
        databaseFunctions.getAllExistingDiscoveries($cordovaSQLite).then(function (allDiscoveries) {
            var discovery;
            for (var i = 0; i < allDiscoveries.length; i++) {
                if (allDiscoveries[i].Name == discoveryName) {
                    discovery = allDiscoveries[i];
                };
            };

            discovery.AvailabilityDate = currentDateInMS + oneHourInMS;
            user.FoundDiscoveries.push(discovery);
            databaseFunctions.updateAllUserData($cordovaSQLite, user);
        });
    };


    var processDiscovery = function (discoveryName, dontDisplayMessageIfCooldown) {
        if (typeof dontDisplayMessageIfCooldown == 'undefined') {
            dontDisplayMessageIfCooldown = false;
        };

        databaseFunctions.getUser($cordovaSQLite).then(function (user) {

            // Check if the use already found this discovery, and if it's still on cooldown             
            var minutesTillAvailable = getDiscoveryCooldownInMinutesForUser(discoveryName, user);
            var discoveryIsOnCooldown = minutesTillAvailable > 0;
            var discoveryWasntFoundYet = minutesTillAvailable < 0;

            if (discoveryIsOnCooldown) {
                if (dontDisplayMessageIfCooldown == false) {
                    displayDiscoveryOnCooldown(discoveryName, minutesTillAvailable);
                };
                return;
            } else if (discoveryWasntFoundYet) {
                setDiscoveryAsFoundForUser(discoveryName, user);
                rewardUser(user);
                displayDiscoveryName(discoveryName);
            } else {    // Discovery was already found and not on cooldown, just set the new cooldown
                resetCooldownOnDiscoveryForUser(discoveryName, user);
                rewardUser(user);
                displayDiscoveryName(discoveryName);
            };
        });
    };

    // This function is called by an on-click event in the potionDiscoveryView
    var touchCounter = 0;
    var dontDisplayMessageIfCooldown = true;
    $scope.touchDiscovery = function () {
        touchCounter++;
        if (touchCounter >= 5) {
            processDiscovery('Discovery of Touch');
            touchCounter = 0;
        };
    };

    var discoveryOfDay = function (user) {
        var currentHour = (new Date).getHours();
        var itIsDayTime = currentHour >= 8 && currentHour < 20;
        if (itIsDayTime) {
            processDiscovery('Discovery of Day', dontDisplayMessageIfCooldown);
        };
    };

    var discoveryOfNight = function (user) {
        var currentHour = (new Date).getHours();
        var itIsNightTime = currentHour >= 20 || currentHour < 8;
        if (itIsNightTime) {
            processDiscovery('Discovery of Night', dontDisplayMessageIfCooldown);
        };
    };

    var discoveryOfGhosts = function (user) {
        var currentHour = (new Date).getHours();
        var itIsGhostTime = currentHour == 0;
        if (itIsGhostTime) {
            processDiscovery('Discovery of Ghosts', dontDisplayMessageIfCooldown);
        };
    };

    var discoveryOfPerseverance = function (user) {
        // Increase counter for discoveryOfPerseverance, since this method is called when the discoveryView is opened
        var discoveryName = 'Discovery of Perseverance';
        var screenOpenedCounter = getDiscoveryDataForUserDiscovery(discoveryName, user);
        if (typeof screenOpenedCounter != 'undefined') {
            screenOpenedCounter = parseInt(screenOpenedCounter) + 1;
        } else {
            screenOpenedCounter = 1;
        };
                
        if (screenOpenedCounter >= 50) {
            processDiscovery(discoveryName);
            setDiscoveryDataForUserDiscovery(discoveryName, user, 0);
        } else {
            setDiscoveryDataForUserDiscovery(discoveryName, user, screenOpenedCounter);
        };       
    };

    // This function is called when the potionDiscoveryView is opened
    $scope.$on('$ionicView.enter', function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            touchCounter = 0; // This can be increased by clicks, when >= 5 PotionOfTouch is discovered (see touchDiscovery)

            discoveryOfPerseverance(user);
			discoveryOfDay(user);
			discoveryOfNight(user);
			discoveryOfGhosts(user);
			
			// Check for these discoveries in 1 Sec intervals
            $interval(function () {
                discoveryOfDay(user);
                discoveryOfNight(user);
                discoveryOfGhosts(user);
           }, 1000);
        });
    });
});