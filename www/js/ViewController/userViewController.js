myApp.controller('userViewController', function ($scope, $cordovaSQLite, databaseFunctions) {

    $scope.$on('$ionicView.enter', function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            $scope.user = user;
            var potionValue = 0;
            for (var i = 0; i < user.OwnedPotions.length; i++) {
                potionValue += user.OwnedPotions[i].Price * user.OwnedPotions[i].Amount;
            };
            $scope.potionValue = potionValue;
            $scope.showOwnedPotionsFunction();

            // Calc the minutes when the found discoveries will be available again
            for (var i = 0; i < user.FoundDiscoveries.length; i++) {
                var millisecondsTillAvailable = user.FoundDiscoveries[i].AvailabilityDate - (new Date).getTime();
                var minutesTillAvailable = Math.round(millisecondsTillAvailable / (1000 * 60));
                var minutesTillAvailableReducedByItems = minutesTillAvailable - Math.round(minutesTillAvailable * user.DiscoveryCDReductionPercentage / 100);
                if (minutesTillAvailable < 0) {
                    user.FoundDiscoveries[i].AvailabilityText = 'Now available.'
                    user.FoundDiscoveries[i].ImageFilename = 'OK.png';
                } else {
                    user.FoundDiscoveries[i].AvailabilityText = minutesTillAvailableReducedByItems + ' minutes until available.';
                    user.FoundDiscoveries[i].ImageFilename = 'Cooldown.png';
                };
            };
        });

        databaseFunctions.getAllExistingQuests($cordovaSQLite).then(function (allQuests) {
            $scope.allQuests = allQuests;
        });

        databaseFunctions.getAllExistingDiscoveries($cordovaSQLite).then(function (allDiscoveries) {
                $scope.allDiscoveries = allDiscoveries;
        });
    });   

    $scope.showOwnedPotionsFunction = function () {
        $scope.potionBorder = "dashed";
        $scope.questBorder = "none";
        $scope.discoveryBorder = "none";
        
        $scope.showPotions = 'block';
        $scope.showSolvedQuests = 'none';
        $scope.showDiscoveries = 'none';
    };

    $scope.showSolvedQuestsFunction = function () {      
        $scope.potionBorder = "none";
        $scope.questBorder = "dashed";
        $scope.discoveryBorder = "none";

        $scope.showPotions = 'none';
        $scope.showSolvedQuests = 'block';
        $scope.showDiscoveries = 'none';
    };
    
    $scope.showFoundDiscoveriesFunction = function () {    
        $scope.potionBorder = "none";
        $scope.questBorder = "none";
        $scope.discoveryBorder = "dashed";
        
        $scope.showPotions = 'none';
        $scope.showSolvedQuests = 'none';
        $scope.showDiscoveries = 'block';
    };
});