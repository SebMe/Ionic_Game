myApp.controller('userViewController', function ($scope, $cordovaSQLite, $timeout, databaseFunctions) {

    $scope.$on('$ionicView.beforeEnter', function () {
		$timeout(function(){
			databaseFunctions.getUser($cordovaSQLite).then(function (user) {
				$scope.user = user;
				var potionValue = 0;
				for (var i = 0; i < user.OwnedPotions.length; i++) {
					potionValue += user.OwnedPotions[i].Price * user.OwnedPotions[i].Amount;
				};
				$scope.potionValue = potionValue;
				$scope.showOwnedPotionsFunction();

				// Calc item value
				var itemValue = 0;
				for (var i = 0; i < user.OwnedItems.length; i++) {
					itemValue += user.OwnedItems[i].Price;
					if(user.OwnedItems[i].Equipped == 'true'){user.OwnedItems[i].BackgroundColor = 'limegreen';};
				};
				$scope.itemValue = itemValue;
				
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
		}, 300);

        databaseFunctions.getAllExistingQuests($cordovaSQLite).then(function (allQuests) {
            $scope.allQuests = allQuests;
        });

        databaseFunctions.getAllExistingDiscoveries($cordovaSQLite).then(function (allDiscoveries) {
                $scope.allDiscoveries = allDiscoveries;
        });
    });   

	var setBorder = function(potionBorder, questBorder, discoveryBorder, itemBorder){
		$scope.potionBorder = potionBorder;
        $scope.questBorder = questBorder;
        $scope.discoveryBorder = discoveryBorder;
        $scope.itemBorder = itemBorder;
	}
	
	var showList = function(showPotions, showSolvedQuests, showDiscoveries, showItems){
		$scope.showPotions = showPotions;
        $scope.showSolvedQuests = showSolvedQuests;
        $scope.showDiscoveries = showDiscoveries;
		$scope.showItems = showItems;
	};
	
    $scope.showOwnedPotionsFunction = function () {
        setBorder('dashed', 'none', 'none', 'none');	
        showList('block', 'none', 'none', 'none');
    };

    $scope.showSolvedQuestsFunction = function () {      
        setBorder('none', 'dashed', 'none', 'none');
		showList('none', 'block', 'none', 'none');
    };
    
    $scope.showFoundDiscoveriesFunction = function () {    
        setBorder('none', 'none', 'dashed', 'none');
		showList('none', 'none', 'block', 'none');
    };
	
	$scope.showOwnedItemsFunction = function () {
        setBorder('none', 'none', 'none', 'dashed');
        showList('none', 'none', 'none', 'block');
    };
	
	$scope.discoveryTouched = function(){
		$scope.linebreak = "item-text-wrap";
	}
	
	$scope.discoveryReleased = function(){
		$scope.linebreak = null;
	}
});