myApp.controller('questViewController', function ($scope, $cordovaSQLite, $ionicPopup, $timeout, databaseFunctions) {

    $scope.$on('$ionicView.enter', function () {
  		databaseFunctions.getAllExistingQuests($cordovaSQLite).then(function (allQuests) {
            databaseFunctions.getUser($cordovaSQLite).then(function (user) {
                for (var i = 0; i < user.SolvedQuests.length; i++) {
                    setQuestImageToSolved(user.SolvedQuests[i].Name, allQuests);
                };
                setQuestColorGreenIfSolvable(allQuests, user);

				// We create arrays of size [rubys] to be able to use the ng-repeat in the view
				for (var i = 0; i < allQuests.length; i++) {
					allQuests[i].Rubycount = [];
					for (var x = 0; x < allQuests[i].Rubys; x++) {
						 allQuests[i].Rubycount.push(x);
					};
				};		
					
                $scope.allQuests = allQuests;
            });
        });
    });

    var setQuestImageToSolved = function(name, allQuests){
        for (var i = 0; i < allQuests.length; i++) {
            if (allQuests[i].Name == name) {
                allQuests[i].ImageFilename = 'img/OK.png';
            }
        };
    }

    var userHasXAmountOfPotion = function(potion, amount, userPotions){
        for (var i = 0; i < userPotions.length; i++) {
            if(userPotions[i].ID == potion.ID && userPotions[i].Amount >= amount){
                return true;
            };
        }
        return false;
    }
					
    var userHasDiscoveryNotOnCooldown = function (user, discovery) {
        for (var i = 0; i < user.FoundDiscoveries.length; i++) {
			var currentDateInMS = (new Date).getTime();
			var millisecondsTillAvailable = user.FoundDiscoveries[i].AvailabilityDate - currentDateInMS;
			var minutesTillAvailable = Math.round(millisecondsTillAvailable / (1000 * 60));     
			var minutesTillAvailableReducedByItems = minutesTillAvailable - Math.round(minutesTillAvailable * user.DiscoveryCDReductionPercentage / 100);			
		   if (user.FoundDiscoveries[i].ID == discovery.ID && minutesTillAvailableReducedByItems < 0) {
				return true;
            };
        };
        return false;
    };

	var resetDiscoveries = function (discoveryList, user) {
        var currentDateInMS = (new Date).getTime();
        var oneHourInMS = (1000 * 60 * 60);
        for (var x = 0; x < discoveryList.length; x++) {
			for (var i = 0; i < user.FoundDiscoveries.length; i++) {
				if (user.FoundDiscoveries[i].Name == discoveryList[x].Name) {
					user.FoundDiscoveries[i].AvailabilityDate = currentDateInMS + oneHourInMS;
				};
			};
		};
    };
	
    var setQuestColorGreenIfSolvable = function(allQuests, user){
        for (var i = 0; i < allQuests.length; i++) {
            var solvable = true;
            var currentQuestRequiredPotions = allQuests[i].RequiredPotions;
            for (var x = 0; x < currentQuestRequiredPotions.length; x++) {
                solvable = solvable && userHasXAmountOfPotion(currentQuestRequiredPotions[x], currentQuestRequiredPotions[x].AmountNeeded, user.OwnedPotions);
            };

            var userHasAllDiscoveries = true;
            var currentQuestRequiredDiscoveries = allQuests[i].Discoveries;
            for (var y = 0; y < currentQuestRequiredDiscoveries.length; y++) {
                userHasAllDiscoveries = userHasAllDiscoveries && userHasDiscoveryNotOnCooldown(user, currentQuestRequiredDiscoveries[y]);
            };

            solvable = solvable && userHasAllDiscoveries;

            if (solvable) {
                allQuests[i].backgroundColor = 'lightgreen';
            } else {
                allQuests[i].backgroundColor = 'white';
            };
        };
    };

    $scope.questClicked = function (quest) {
        $scope.quest = quest;
		var questSolvable = quest.backgroundColor == 'lightgreen';
        if (questSolvable) {
            $ionicPopup.show({
                template:
				'<style>.popup {min-width:50%;}</style>'+
				'<img src="{{quest.ImageFilename}}"/>'+
				'<h2>{{quest.Name}}</h2>'+
				'<p>{{quest.Rubys}}<img src="img/Ruby.png" style="height: 2em;"/></p>       '+
				'<p>{{quest.Description}}</p>'+
				'<p>Type: {{quest.Type}}</p>'+
				'<p ng-repeat="rewardPotion in quest.RewardPotions"> Reward Potion: {{rewardPotion.RewardAmount}} x {{rewardPotion.Name}}</p>'+
				'<p ng-repeat="requiredPotion in quest.RequiredPotions"> Required Potion: {{requiredPotion.AmountNeeded}} x {{requiredPotion.Name}}</p>'+
				'<p ng-repeat="requiredDiscovery in quest.Discoveries"> Required Discovery: {{requiredDiscovery.Name}}</p>'+
				'</a>',
                title: quest.Name,
                scope: $scope,
                buttons: [
                  { text: 'Cancel' },
                  {
                      text: '<b>Solve Quest</b>',
                      type: 'button-balanced',
                      onTap: function (e) {
                          solveQuestFunction(quest);
                      }
                  }
                ]
            });
        };
    };


    var removeRequiredQuestPotionsFromUser = function (potionsToRemove, user) {
        for (var i = 0; i < user.OwnedPotions.length; i++) {
            for (var x = 0; x < potionsToRemove.length; x++) {
                if (user.OwnedPotions[i].ID == potionsToRemove[x].ID) {
                    user.OwnedPotions[i].Amount -= potionsToRemove[x].AmountNeeded;
                };
            };
        };
    };

    var rewardUser = function (quest, user, allExistingPotions) {
		//var rewardPotions = quest.RewardPotions;      
		var bonusPotions = [];
		for(var i = 0; i < user.ExtraPotionOnQuest; i++){				
			var bonusPotionIndex = Math.round(Math.random()*100) % allExistingPotions.length; // Will be between 0 and length-1
			allExistingPotions[bonusPotionIndex].RewardAmount = 1;
			bonusPotions.push(allExistingPotions[bonusPotionIndex]);			
		};	
		
		//addPotionsToUser(user, rewardPotions);					
		addPotionsToUser(user, bonusPotions);		
		user.AmountOfGold += quest.Rewardmoney;
		user.Rubys += quest.Rubys;
		
		//showRewardPotionPopup(quest.RewardPotions, "Reward potions");
		
		showRewardRubyPopup(quest.Rubys);
		if(bonusPotions.length > 0){
			//$timeout(function () {showRewardPotionPopup(bonusPotions, "Bonus potions");}, 200);
			$timeout(function () {showRewardPotionPopup(bonusPotions, "Bonus potions");}, 1000);
		};	
    };

	var addPotionsToUser = function(user, potions){
		for (var i = 0; i < potions.length; i++) {
            var potionAmountIncreased = false;
			for (var x = 0; x < user.OwnedPotions.length; x++) {
                if (user.OwnedPotions[x].ID == potions[i].ID) {
                    user.OwnedPotions[x].Amount += potions[i].RewardAmount;
                    potionAmountIncreased = true;
                };
            };

            // User didnt have any amount of this potion type, so we have to add it
            if (potionAmountIncreased == false) {
                potions[i].Amount = potions[i].RewardAmount;
                user.OwnedPotions.push(potions[i]);
            };			
        };
	};
	
	var showRewardRubyPopup = function(rubyCount){
		var resultPopup = $ionicPopup.show({
                template:                    
                        '<img src="img/Ruby.png" style="margin-left:20%; width:60%">',
                title: '<h1> +'+rubyCount+' </h1>',
                scope: $scope
            });
            $timeout(function () {resultPopup.close();}, 600);
	};
	
	var showRewardPotionPopup = function(potionsToShow, popuptitle){
		$scope.potionsList = potionsToShow;
		var popupTitle = 'Reward potions received';
		var rewardPotionPopup = $ionicPopup.show({
                template:
				 '<style>.popup {min-width:50%;}</style>'+
				 '<ion-list>' +
                        '  <ion-item ng-repeat="potion in potionsList"> ' +
                        '    <img src="img/{{potion.ImageFilename}}">' +
                        '     <h2>{{potion.RewardAmount}} {{potion.Name}}</h2>' +
                        '     <p>{{potion.Description}}</p>' +
                        '     <p>Rank: {{potion.Rank}}</p>' +
                        '     <p>Price: {{potion.Price}}</p> ' + 
                        '  </ion-item>' +
				  '</ion-list>',
                title: popuptitle,
                scope: $scope
            });
		$timeout(function () {
			rewardPotionPopup.close();
			}, 600);
	};
	
	$scope.questTouched = function(){
		$scope.linebreak = "item-text-wrap";
	}
	
	$scope.questReleased = function(){
		$scope.linebreak = null;
	}
	
    var solveQuestFunction = function (quest) {

        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
			databaseFunctions.getAllExistingPotions($cordovaSQLite).then(function(allExistingPotions){	 		
				user.SolvedQuests.push(quest);
				removeRequiredQuestPotionsFromUser(quest.RequiredPotions, user);
				resetDiscoveries(quest.Discoveries, user);
				rewardUser(quest, user, allExistingPotions);
				databaseFunctions.updateAllUserData($cordovaSQLite, user);           
				setQuestImageToSolved(quest.Name, $scope.allQuests);
				setQuestColorGreenIfSolvable($scope.allQuests, user);
			});
		});
    };
})