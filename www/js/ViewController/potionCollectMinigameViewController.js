myApp.controller('potionCollectMinigameViewController', function ($scope, $cordovaSQLite, $interval, $timeout, $ionicPopup, databaseFunctions, itemService) {	
	$scope.$on('$ionicView.enter', function(){
		$interval.cancel($scope.potionInterval);	
		resetValuesToInit();	
	});
	
	var resetValuesToInit = function(){
		$scope.hideImage1IfSetToNone = 'none';
		$scope.hideImage2IfSetToNone = 'none';
		$scope.hideImage3IfSetToNone = 'none';
		$scope.hideStartTextIfSetToNone = 'block';
		$scope.score = 0;
		$scope.rewardBackgroundColor = null;
		$scope.randomRolledItem = null;
		$scope.popupBackgroundColor = null;
		$scope.discoveryCDRedctionEarned = false;
		$scope.discoveryReward = null;
	};
	var scoreForCooldownReduction = 200;
	var scoreForItem = 300;
	var scoreForDiscovery = 500;
	$scope.startGame = function(){
		$scope.hideStartTextIfSetToNone = 'none';
		$scope.potionInterval = $interval(function(){
			displayImage(1);
			var goldImageNotShown = $scope.hideImage3IfSetToNone == 'none';
			if($scope.score >= 50 && goldImageNotShown){displayImage(3);};
			if($scope.score >= 100){displayImage(2);};
			if($scope.score < scoreForCooldownReduction){$scope.rewardBackgroundColor = null;}
			if($scope.score >= scoreForCooldownReduction && $scope.score < scoreForItem){$scope.rewardBackgroundColor = 'limegreen';};
			if($scope.score >= scoreForItem && $scope.score < scoreForDiscovery){$scope.rewardBackgroundColor = '#ffb90f';};
			if($scope.score >= scoreForDiscovery){$scope.rewardBackgroundColor = 'lightblue';};
			removeImageAfterXTime(1000 - $scope.score/2, 1);	
			removeImageAfterXTime(1000 - $scope.score/2, 2);
		}, 2000 - $scope.score);
	};
	
	var removeImageAfterXTime = function(time, imageNr){
		$timeout(function(){
			var imageNotClickedInTime = true;
			
			if(imageNr == 1){
				imageNotClickedInTime = $scope.hideImage1IfSetToNone == 'block';
				$scope.hideImage1IfSetToNone = 'none';
			} else if(imageNr == 2){
				imageNotClickedInTime = $scope.hideImage2IfSetToNone == 'block';
				$scope.hideImage2IfSetToNone = 'none';
			};
			
			if(imageNotClickedInTime && $scope.score - 10 >= 0){
				$scope.score -= 10;
			};			
		},time);
	};
	
	var displayImage = function(imageNr){
		if(imageNr == 1){
			$scope.marginTop1 = Math.random()*70;
			$scope.marginLeft1 = Math.random()*70;
			$scope.hideImage1IfSetToNone = 'block'
		} else if(imageNr == 2){
			$scope.marginTop2 = Math.random()*70;
			$scope.marginLeft2 = Math.random()*70;
			$scope.hideImage2IfSetToNone = 'block'
		}else if(imageNr == 3){
			$scope.marginTop3 = Math.random()*70;
			$scope.marginLeft3 = Math.random()*70;
			$scope.hideImage3IfSetToNone = 'block'
		};
	};
	
	$scope.imageClicked = function(imageNr){
		$scope.score += 10;
		if(imageNr == 1){
			$scope.hideImage1IfSetToNone = 'none';
		}else if(imageNr == 2){
			$scope.hideImage2IfSetToNone = 'none';
		}else if(imageNr == 3){
			$scope.hideImage3IfSetToNone = 'none';
		};	
	};

	var addDiscoveryToUser = function(discovery, user){
		var userAlreadyHasDiscovery = false;
		for(var i = 0; i < user.FoundDiscoveries.length; i++){
			if(user.FoundDiscoveries[i].ID == discovery.ID){
				userAlreadyHasDiscovery = true;
			};
		};
		if(userAlreadyHasDiscovery == false){
			discovery.AvailabilityDate = (new Date).getTime()-300000; // -5min to make directly available
			user.FoundDiscoveries.push(discovery);
		};
	};
	
	$scope.takeReward = function(reward){
		$scope.reward = reward;
		$interval.cancel($scope.potionInterval);
		showResultPopup();	
		
		databaseFunctions.getUser($cordovaSQLite).then(function(user){
			if(reward >= scoreForCooldownReduction){
				$scope.popupBackgroundColor = 'limegreen';
				$scope.discoveryCDRedctionEarned = true;
				for(var i = 0; i < user.FoundDiscoveries.length; i++){
					user.FoundDiscoveries[i].AvailabilityDate -= 60000;
				};
			};
			if(reward >= scoreForItem){
				var itemClasses = itemService.getAllItemClasses(0); // 0 = trader discount irrelevant if the user gets the item for free
				var itemClassesIndex = Math.round(Math.random()*100) % itemClasses.length;
				$scope.randomRolledItem = itemService.createItem(itemClasses[itemClassesIndex]);
				user.OwnedItems.push($scope.randomRolledItem);
			};
			if(reward >= scoreForDiscovery){
				$scope.popupBackgroundColor = 'lightblue';
				databaseFunctions.getAllExistingDiscoveries($cordovaSQLite).then(function(allExistingDiscoveries){					
					var discoveryIndex = Math.round(Math.random()*100) % allExistingDiscoveries.length;
					$scope.discoveryReward = allExistingDiscoveries[discoveryIndex];
					addDiscoveryToUser($scope.discoveryReward, user);
					user.AmountOfGold += reward;
					databaseFunctions.updateAllUserData($cordovaSQLite, user);
				});				
			}else{
				user.AmountOfGold += reward;
				databaseFunctions.updateAllUserData($cordovaSQLite, user);
			};				
		});
		
		resetValuesToInit();
	}
	
	var showResultPopup = function(){		
		$scope.resultPopup = $ionicPopup.show({
					template:
							'<style>.popup {min-width:30%;} .popup-body{ background-color: {{popupBackgroundColor}}} .popup-head{ background-color: gold}</style>'+
							'<h1 align="center" style="font-size:50px;">+ {{reward}} <img src="img/Gold.png" style="height: 30px;"</h1>'+
							'<h1 align="center" ng-show="discoveryCDRedctionEarned">- 1 minute on all cooldowns!</h1>'+
							'<h1 align="center" ng-show="discoveryReward">{{discoveryReward.Name}}</h1>',
					scope: $scope,
					title: 'Reward',
					buttons: [
					{ 	text: 'Awesome!',
						onTap: function (e) {
						  $scope.resultPopup.close();
						  $timeout(function () { itemService.showItemPopup($scope, $scope.randomRolledItem); }, 200); // Timeout needed so ionic has time to close this popup before opening the next
						}	
					}]
				});
	};	
});