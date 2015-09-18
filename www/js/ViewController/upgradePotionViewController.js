myApp.controller('upgradePotionViewController', function ($scope, $cordovaSQLite, $ionicPopup, $timeout, databaseFunctions) {
    //http://forum.ionicframework.com/t/list-inside-the-popup-scrolling/13176
    $scope.showPotionSelectPopup = function () {

        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            $scope.userOwnedPotions = user.OwnedPotions;

            $scope.listPopup = $ionicPopup.show({
                template: '<ion-list>                                ' +
                        '  <ion-item ng-repeat="potion in userOwnedPotions" ng-click = "potionSelected(potion)"> ' +
                        '    <img src="img/{{potion.ImageFilename}}">' +
                        '     <h2> <span style="color:{{amountColor || black}};">{{potion.Amount}}</span> {{potion.Name}}</h2>' +
                        '     <p>{{potion.Description}}</p>' +
                        '     <p>Rank: {{potion.Rank}}</p>' +
                        '      <p>Price: {{potion.Price}}</p> ' + 
                        '  </ion-item>                             ' +
                          '</ion-list>                               ',

                title: 'Owned Potions',
                scope: $scope,
                buttons: [
                  { text: 'Cancel' }
                ]
            });
        });
    };

    $scope.selectedPotion;
    $scope.upgradedPotionToAdd;
    $scope.potionSelected = function (potion) {
        // Only allow a potion to be selected if the user has at least 2 of it
        if (potion.Amount < 2) {
            $scope.amountColor = "red";
            $timeout(function () {
                $scope.amountColor = "black";
            }, 300);
        } else {
            $scope.listPopup.close();
            $scope.selectedPotionImage = potion.ImageFilename;
            
            databaseFunctions.getAllExistingPotions($cordovaSQLite).then(function (allExistingPotions) {               
                var higherRankFoundAtPosition = -1;
                for (var i = 0; i < allExistingPotions.length; i++) {
                    if (potion.Class == allExistingPotions[i].Class && potion.Rank == (allExistingPotions[i].Rank - 1)) {
                        higherRankFoundAtPosition = i;
                        $scope.okImageFilename = 'OK.png';
                    };
                };
                if (higherRankFoundAtPosition != -1) {
                    $scope.resultPotionImageFilename = allExistingPotions[higherRankFoundAtPosition].ImageFilename;
                    $scope.selectedPotion = potion;
                    $scope.upgradedPotionToAdd = allExistingPotions[higherRankFoundAtPosition];
                } else {
                    $scope.resultPotionImageFilename = null;
                };
            });
        };
    };

  
    // The 2 selected Potions of the same class and rank will be removed and one of the higher rank and same class addded
    $scope.upgradePotion = function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            var higherPotionAdded = false;
            var bonusPotion = user.ChanceExtraPotionOnUpgrade >= (Math.random()*100);
			$scope.resultAmount = 1;
			if(bonusPotion){$scope.resultAmount++;};
			
			for (var i = 0; i < user.OwnedPotions.length; i++) {
                if (user.OwnedPotions[i].ID == $scope.selectedPotion.ID) {
                    user.OwnedPotions[i].Amount -= 2;
                };

                if (user.OwnedPotions[i].ID == $scope.upgradedPotionToAdd.ID) {
                    user.OwnedPotions[i].Amount += $scope.resultAmount;
                    higherPotionAdded = true;
                };
            };

            // If the user didnt have any amount of this potion, so we couldnt just increase the amount, we add it now with amount 1
            if (higherPotionAdded == false) {
                $scope.upgradedPotionToAdd.Amount = $scope.resultAmount;
                user.OwnedPotions.push($scope.upgradedPotionToAdd);                
            };


            $scope.selectedPotionImage = 'UnselectedPotion.png';
            $scope.resultPotionImageFilename = null;
            $scope.okImageFilename = null;
            databaseFunctions.updateAllUserData($cordovaSQLite, user);

           
            var resultPopup = $ionicPopup.show({
                template:
                        '<style>.popup {min-width:30%;}</style>'+
                        '<img src="img/{{upgradedPotionToAdd.ImageFilename}}" style="margin-left:15%;">',

                title: '<h1> +'+$scope.resultAmount+' </h1>',
                scope: $scope
            });
            $timeout(function () {resultPopup.close();}, 600);
        });
    };
});