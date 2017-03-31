myApp.controller('traderViewController', function ($scope, $cordovaSQLite, $cordovaNativeAudio, $timeout, $ionicPopup, $q, databaseFunctions, itemService) {
    $scope.$on('$ionicView.enter', function () {		
		databaseFunctions.getUser($cordovaSQLite).then(function (user) {            	
			for (var i = 0; i < user.OwnedItems.length; i++) {
                if (user.OwnedItems[i].Equipped == 'true') {
                    user.OwnedItems[i].BackgroundColor = 'limegreen';
                }
            };

			for (var i = 0; i < user.OwnedPotions.length; i++) {
                var potionPriceAdjustedToDiscount = user.OwnedPotions[i].Price - Math.round(user.OwnedPotions[i].Price * user.TraderDiscountPercentage / 100);
				user.OwnedPotions[i].PriceDiscountAdjusted = potionPriceAdjustedToDiscount;
				user.OwnedPotions[i].HalfPriceDiscountAdjusted = Math.round(potionPriceAdjustedToDiscount/2);
            };
			
            // Pre select some modus, or in case we returned to his view, reset the item prices
            var backgroundColorSelected = 'limegreen';
            var buyPotionSelected = $scope.buyColor == backgroundColorSelected;
            var sellPotionSelected = $scope.sellColor == backgroundColorSelected;
            var buyItemSelected = $scope.buyItemColor == backgroundColorSelected;
            var sellItemSelected = $scope.sellItemColor == backgroundColorSelected;
            var noModusSelected = (buyPotionSelected || sellPotionSelected || buyItemSelected || sellItemSelected) != true;
            
			if (noModusSelected) {
                $scope.buyColor = backgroundColorSelected;
				buyPotionSelected = true;
            };

            if (buyPotionSelected) {
                $scope.showPotionsToBuy();
            } else if (sellPotionSelected) {
                $scope.showAllUserpotions();
            } else if (buyItemSelected) {
                $scope.showItemsToBuy();
            } else if (sellItemSelected) {
                $scope.showAllUserItems();
            };
			
			$scope.user = user;
        });

        // Preload sounds that can be used in the view
        //$cordovaNativeAudio.preloadSimple('moneySound', 'sounds/money.mp3');
		//$cordovaNativeAudio.preloadSimple('successSound', 'sounds/success.mp3');
	});
	
	$scope.$on('$ionicView.beforeLeave', function () {
		databaseFunctions.updateAllUserData($cordovaSQLite, $scope.user);
	});

    var showListForModus = function (modus) {
        $scope.displayBuyPotionList = 'none';
        $scope.displaySellPotionList = 'none';
        $scope.displayBuyItemList = 'none';
        $scope.displaySellItemList = 'none';

        if (modus == 'buyPotions') {
            $scope.displayBuyPotionList = 'block';
        } else if (modus == 'sellPotions') {
            $scope.displaySellPotionList = 'block';
        } else if (modus == 'buyItems') {
            $scope.displayBuyItemList = 'block';
        } else if (modus == 'sellItems') {
            $scope.displaySellItemList = 'block';
        };
    };

    var setBackgroundColorForModus = function (modus) {
        var backgroundColor = '#c8c8c8';
        var backgroundColorSelected = 'limegreen';

        $scope.buyColor = backgroundColor
        $scope.sellColor = backgroundColor
        $scope.buyItemColor = backgroundColor
        $scope.sellItemColor = backgroundColor

        if (modus == 'buyPotions') {
            $scope.buyColor = backgroundColorSelected;
        } else if (modus == 'sellPotions') {
            $scope.sellColor = backgroundColorSelected;
        } else if (modus == 'buyItems') {
            $scope.buyItemColor = backgroundColorSelected;
        } else if (modus == 'sellItems') {
            $scope.sellItemColor = backgroundColorSelected;
        };
    };

    // Called by click on the x-axis buttons that select the modus
    $scope.showPotionsToBuy = function () {
        databaseFunctions.getAllExistingPotions($cordovaSQLite).then(function (allPotions) {
            for (var i = 0; i < allPotions.length; i++) {
                var potionPriceAdjustedToDiscount = allPotions[i].Price - Math.round(allPotions[i].Price * $scope.user.TraderDiscountPercentage / 100);
                allPotions[i].PriceDiscountAdjusted = potionPriceAdjustedToDiscount;
            };
            $scope.potionsToBuy = allPotions;
            showListForModus('buyPotions');
            setBackgroundColorForModus('buyPotions');
        });
    };

    // Called by click on the x-axis buttons that select the modus
    $scope.showAllUserpotions = function () {
		showListForModus('sellPotions');
		setBackgroundColorForModus('sellPotions');
    };
    
    // Called by click on the x-axis buttons that select the modus
    $scope.showItemsToBuy = function () {
		var traderDiscountPercentage = $scope.user.TraderDiscountPercentage;
        $scope.itemClassesToBuy = itemService.getAllItemClasses(traderDiscountPercentage);
        showListForModus('buyItems');
        setBackgroundColorForModus('buyItems');
    };

    // Called by click on the x-axis buttons that select the modus
    $scope.showAllUserItems = function () {
		for (var i = 0; i < $scope.user.OwnedItems.length; i++) {
			if ($scope.user.OwnedItems[i].Equipped == 'true') {
				$scope.user.OwnedItems[i].BackgroundColor = 'limegreen';
			}
		};
		showListForModus('sellItems');
		setBackgroundColorForModus('sellItems');
    };

    // Called by click on the y-axis scroll-list element to buy that potion
	$scope.buyPotion = function (potion) {		
	 // Potion retrieved from the Potions_Table has no Amount field, need to add Amount since a potion the user possesses has an Amount
		potion.Amount = 1;
		if ($scope.user.AmountOfGold - potion.Price >= 0) {
			var addedPotion = false;
			// Check all potions the user has, if found increase amount
			for (var i = 0; i < $scope.user.OwnedPotions.length; i++) {
				if (potion.ID == $scope.user.OwnedPotions[i].ID) {
					$scope.user.OwnedPotions[i].Amount++;
					$scope.user.AmountOfGold -= potion.PriceDiscountAdjusted;
					addedPotion = true;
				};
			};
			// User didnt have the potion yet, add it
			if (addedPotion == false) {
				$scope.user.OwnedPotions.push(potion);
				$scope.user.AmountOfGold -= potion.PriceDiscountAdjusted;
			};		
			
			$scope.traderImage = 'TraderReaction.png'
			$timeout(function () {
				$scope.traderImage = 'Trader.png';
			}, 500);
		}; 	  
    };

    // Called by click on the y-axis scroll-list element to sell that potion
    $scope.sellPotion = function (potion) {
        var user = $scope.user;
        var soldPotionIndex;
        for (var i = 0; i < user.OwnedPotions.length; i++) {
            if (potion.ID == user.OwnedPotions[i].ID && user.OwnedPotions[i].Amount > 0) {
                user.OwnedPotions[i].Amount--;
                user.AmountOfGold += potion.HalfPriceDiscountAdjusted;
                soldPotionIndex = i;
                // Play a Money Sound (is native, so has to be commented out for app to still work while pc-testing in chrome)
                //$cordovaNativeAudio.play('moneySound');
                $scope.traderImage = 'TraderReaction.png'
                $timeout(function () {
                    $scope.traderImage = 'Trader.png';
                }, 500);
            };
        };
    };

    // Called when the user clicked an itemClass to buy it
    $scope.showBuyItemAreYouSurePopup = function (itemClass) {
        $scope.itemClass = itemClass;
        if ($scope.user.AmountOfGold >= itemClass.Price) {
            $scope.buyItemAreYouSurePopup = $ionicPopup.show({
                template:
                    '<style>.popup {min-width:90%;} .popup-body{ background-color: #c8c8c8} .popup-head{ background-color: #ffb90f}</style>' +
                    '<img src="img/{{itemClass.ImageFilename}}" style="margin-right:15%;" >',

                title: 'Buy this item?',
                scope: $scope,
                buttons: [
                  { text: 'Cancel' },
                  {
                      text: '<b>Buy Item</b>',
                      type: 'button-balanced',
                      onTap: function (e) {
                          $scope.buyItemAreYouSurePopup.close();
                          $timeout(function () { $scope.buyItem(itemClass); }, 200); // Timeout needed so ionic has time to close this popup before opening the next
                      }
                  }
                ]
            });
        };
    }

    // Called when the user accepted to buy this item
    $scope.buyItem = function (itemClass) {              
        if ($scope.user.AmountOfGold >= itemClass.Price) {

            $scope.traderImage = 'TraderReaction.png'
            $timeout(function () {
                $scope.traderImage = 'Trader.png';
            }, 500);

			var fullyRolledItem = itemService.createItem(itemClass);     
			itemService.showItemPopup($scope, fullyRolledItem);
			//$cordovaNativeAudio.play('successSound');
						
            $scope.user.OwnedItems.push(fullyRolledItem);
            $scope.user.AmountOfGold -= itemClass.Price;      
        };
    };

    // Called when the user clicked an item to sell it
    $scope.showSellItemAreYouSurePopup = function (item) {
        $scope.userItemToSell = item;
        if (item.Equipped == 'true') {
            $scope.sellTitle = 'Item is equipped, sell anyway?';
            $scope.sellTitleColor = 'red';
        } else {
            $scope.sellTitle = 'Sell item?';
            $scope.sellTitleColor = '#ffb90f';
        };

        $scope.sellItemAreYouSurePopup = $ionicPopup.show({
            template:
                        '<style>.popup {min-width:90%;} .popup-body{ background-color: #c8c8c8} .popup-head{ background-color: {{sellTitleColor}}}</style>' +
                        '<div ng-click=closeItemPopup()>' +
                        '<img src="img/{{userItemToSell.ImageFilename}}" style="margin-right:15%;" >' +
                        ' <h5 ng-show="{{userItemToSell.ChanceExtraPotionOnUpgrade}}">+ {{userItemToSell.ChanceExtraPotionOnUpgrade}}% chance for extra potion on upgrade</h5>' +
					'     <h5 ng-show="{{userItemToSell.DiscoveryCDReductionPercentage}}">+ {{userItemToSell.DiscoveryCDReductionPercentage}}% discovery cooldown reduction</h5>' +
					'     <h5 ng-show="{{userItemToSell.TraderDiscountPercentage}}">+ {{userItemToSell.TraderDiscountPercentage}}% trader discount</h5> ' +
					'     <h5 ng-show="{{userItemToSell.ExtraPotionOnQuest}}">+ {{userItemToSell.ExtraPotionOnQuest}} potion per solved quest</h5>' +
					'     <h5 ng-show="{{userItemToSell.ExtraGoldOnDiscovery}}">+ {{userItemToSell.ExtraGoldOnDiscovery}} extra gold on discovery</h5>'+
                        '</div>',

            title: $scope.sellTitle,
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                  text: '<b>Sell Item</b>',
                  type: 'button-balanced',
                  onTap: function (e) {
                      $scope.sellItemAreYouSurePopup.close();
                      $timeout(function () { $scope.sellItem(item); }, 200); // Timeout needed so ionic has time to close this popup before opening the next
                  }
              }
            ]
        });
    }

    // Called when the user accepted to sell this item
    $scope.sellItem = function (item) {
        var user = $scope.user;
		//$cordovaNativeAudio.play('moneySound');
        $scope.traderImage = 'TraderReaction.png'
        $timeout(function () {
            $scope.traderImage = 'Trader.png';
        }, 500);

		var itemWasBoughtButNotYetStoredInDB = item.ID < 0;
        if(itemWasBoughtButNotYetStoredInDB){
			for (var i = 0; i < user.OwnedItems.length; i++) {
				if (user.OwnedItems[i].ID == item.ID) {
					user.OwnedItems.splice(i, 1);							
				};
			};
		} else {
			var soldItemIndex;
			for (var i = 0; i < user.OwnedItems.length; i++) {
				if (user.OwnedItems[i].ID == item.ID) {
					user.OwnedItems[i].SellItFlag = true;
					user.OwnedItems[i].StoreItFlag = false;
					user.OwnedItems[i].UpdateItFlag = false;
					soldItemIndex = i;

					if (user.OwnedItems[i].Equipped == 'true') {
						user.ChanceExtraPotionOnUpgrade -= user.OwnedItems[i].ChanceExtraPotionOnUpgrade;
						user.ExtraPotionOnQuest -= user.OwnedItems[i].ExtraPotionOnQuest;
						user.ExtraGoldOnDiscovery -= user.OwnedItems[i].ExtraGoldOnDiscovery;
						user.DiscoveryCDReductionPercentage -= user.OwnedItems[i].DiscoveryCDReductionPercentage;
						user.TraderDiscountPercentage -= user.OwnedItems[i].TraderDiscountPercentage;
					};
				};
			};
		};
        user.AmountOfGold += item.Price;
    };
});