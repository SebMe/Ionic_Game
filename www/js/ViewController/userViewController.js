myApp.controller('userViewController', function ($scope, $cordovaSQLite, databaseFunctions) {

    $scope.$on('$ionicView.enter', function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            $scope.user = user;
            var potionValue = 0;
            if(typeof user.OwnedPotions != 'undefined'){
                for (var i = 0; i < user.OwnedPotions.length; i++) {
                    potionValue += user.OwnedPotions[i].Price * user.OwnedPotions[i].Amount;
                    };
            };
            $scope.potionValue = potionValue;
            $scope.showOwnedPotionsFunction();

            // Calc the minutes when the found discoveries will be available again
            for (var i = 0; i < user.FoundDiscoveries.length; i++) {
                var millisecondsTillAvailable = user.FoundDiscoveries[i].AvailabilityDate - (new Date).getTime();
                var minutesTillAvailable = millisecondsTillAvailable / (1000 * 60);
                if (minutesTillAvailable < 0) {
                    user.FoundDiscoveries[i].AvailabilityText = 'The discovery is available.'
                } else {
                    user.FoundDiscoveries[i].AvailabilityText = 'The discovery is available again in '+ Math.round(minutesTillAvailable) + ' minutes.';
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