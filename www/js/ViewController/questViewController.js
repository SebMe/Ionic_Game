myApp.controller('questViewController', function ($scope, $cordovaSQLite, $ionicPopup, databaseFunctions) {

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

    var userHasDiscovery = function (user, discovery) {
        for (var i = 0; i < user.FoundDiscoveries.length; i++) {
            if (user.FoundDiscoveries[i].ID == discovery.ID) {
                return true;
            };
        };
        return false;
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
                userHasAllDiscoveries = userHasAllDiscoveries && userHasDiscovery(user, currentQuestRequiredDiscoveries[y]);
            };

            solvable = solvable && userHasAllDiscoveries;

            if (solvable) {
                allQuests[i].backgroundColor = 'lightgreen';
            } else {
                allQuests[i].backgroundColor = 'white';
            };
        };
    };

    $scope.$on('$ionicView.enter', function () {
        databaseFunctions.getAllExistingQuests($cordovaSQLite).then(function (allQuests) {
            databaseFunctions.getUser($cordovaSQLite).then(function (user) {
                for (var i = 0; i < user.SolvedQuests.length; i++) {
                    setQuestImageToSolved(user.SolvedQuests[i].Name, allQuests);
                };

                setQuestColorGreenIfSolvable(allQuests, user);

                $scope.allQuests = allQuests;
            });
        });
    });

    $scope.questClicked = function (quest) {
        var questSolvable = quest.backgroundColor == 'lightgreen';
        if (questSolvable) {
            $ionicPopup.show({
                template: ' ',

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

    var addQuestRewardPotionsToUser = function (rewardPotions, user) {
        for (var i = 0; i < rewardPotions.length; i++) {
            var potionAmountIncreased = false;
            for (var x = 0; x < user.OwnedPotions.length; x++) {
                if (user.OwnedPotions[x].ID == rewardPotions[i].ID) {
                    user.OwnedPotions[x].Amount += rewardPotions[i].RewardAmount;
                    potionAmountIncreased = true;
                };
            };

            // User didnt have any amount of this potion type, so we have to add it
            if (potionAmountIncreased == false) {
                rewardPotions[i].Amount = rewardPotions[i].RewardAmount;
                user.OwnedPotions.push(rewardPotions[i]);
            }
        };
    };

    var sayHi = function () {
        alert('hi');
    }

    var solveQuestFunction = function (quest) {

        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            user.SolvedQuests.push(quest);
            removeRequiredQuestPotionsFromUser(quest.RequiredPotions, user);
            addQuestRewardPotionsToUser(quest.RewardPotions, user);
            user.AmountOfGold += quest.Rewardmoney;
            databaseFunctions.updateAllUserData($cordovaSQLite, user);           
            setQuestImageToSolved(quest.Name, $scope.allQuests);
            setQuestColorGreenIfSolvable($scope.allQuests, user);
        });
    };
})