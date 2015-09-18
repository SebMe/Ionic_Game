myApp.controller('traderViewController', function ($scope, $cordovaSQLite, $cordovaNativeAudio, $timeout, $ionicPopup, databaseFunctions, itemService) {
    $scope.$on('$ionicView.enter', function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {            
            $scope.user = user;

            for (var i = 0; i < user.OwnedItems.length; i++) {
                if (user.OwnedItems[i].Equipped == 'true') {
                    user.OwnedItems[i].BackgroundColor = 'limegreen';
                }
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
        });

        // Preload sounds that can be used in the view
        $cordovaNativeAudio.preloadSimple('moneySound', 'sounds/money.mp3');
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
                allPotions[i].Price = potionPriceAdjustedToDiscount;
            };
            $scope.potionsToBuy = allPotions;
            showListForModus('buyPotions');
            setBackgroundColorForModus('buyPotions');
        });
    };

    // Called by click on the x-axis buttons that select the modus
    $scope.showAllUserpotions = function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            $scope.user = user;
            showListForModus('sellPotions');
            setBackgroundColorForModus('sellPotions');
        });
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
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            $scope.user = user;

            for (var i = 0; i < user.OwnedItems.length; i++) {
                if (user.OwnedItems[i].Equipped == 'true') {
                    user.OwnedItems[i].BackgroundColor = 'limegreen';
                }
            };

            showListForModus('sellItems');
            setBackgroundColorForModus('sellItems');
        });
    };

    // Called by click on the y-axis scroll-list element to buy that potion
    $scope.buyPotion = function (potion) {
        var user = $scope.user;
        // Potion retrieved from the Potions_Table has no Amount field, need to add Amount since a potion the user possesses has an Amount
        potion.Amount = 1;
        if (user.AmountOfGold - potion.Price >= 0) {
            var addedPotion = false;
            // Check all potions the user has, if found increase amount
            for (var i = 0; i < user.OwnedPotions.length; i++) {
                if (potion.ID == user.OwnedPotions[i].ID) {
                    user.OwnedPotions[i].Amount++;
                    user.AmountOfGold -= potion.Price;
                    addedPotion = true;
                };
            };
            // User didnt have the potion yet, add it
            if (addedPotion == false) {
                user.OwnedPotions.push(potion);
                user.AmountOfGold -= potion.Price;
            };

            $scope.traderImage = 'TraderReaction.png'
            $timeout(function () {
                $scope.traderImage = 'Trader.png';
            }, 500);
        };
        databaseFunctions.updateAllUserData($cordovaSQLite, user);
    };

    // Called by click on the y-axis scroll-list element to sell that potion
    $scope.sellPotion = function (potion) {
        var user = $scope.user;
        var soldPotionIndex;
        for (var i = 0; i < user.OwnedPotions.length; i++) {
            if (potion.ID == user.OwnedPotions[i].ID && user.OwnedPotions[i].Amount > 0) {
                user.OwnedPotions[i].Amount--;
                user.AmountOfGold += potion.Price;
                soldPotionIndex = i;
                // Play a Money Sound (is native, so has to be commented out for app to still work while pc-testing in chrome)
                $cordovaNativeAudio.play('moneySound');
                $scope.traderImage = 'TraderReaction.png'
                $timeout(function () {
                    $scope.traderImage = 'Trader.png';
                }, 500);
            };
        };
        databaseFunctions.updateAllUserData($cordovaSQLite, user);
        // Remove from list if amount is 0, otherwise would be shown in list with amount 0
        if (user.OwnedPotions[soldPotionIndex].Amount == 0) {
            user.OwnedPotions.splice(soldPotionIndex, 1);
        }
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
        var user = $scope.user;
        if (user.AmountOfGold >= itemClass.Price) {

            $scope.traderImage = 'TraderReaction.png'
            $timeout(function () {
                $scope.traderImage = 'Trader.png';
            }, 500);

			var fullyRolledItem = itemService.createItem(itemClass);     
            itemService.showItemPopup($scope, fullyRolledItem);
			
            user.OwnedItems.push(fullyRolledItem);
            user.AmountOfGold -= itemClass.Price;
            databaseFunctions.updateAllUserData($cordovaSQLite, user);
            // Reset the StoreItFlag, otherwise would be added to the database again with next call to updateAllUserData
            var indexOfNewlyAddedItem = user.OwnedItems.length - 1;
            user.OwnedItems[indexOfNewlyAddedItem].StoreItFlag = false;
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
                        '     <h5>+ {{userItemToSell.ChanceExtraPotionOnUpgrade}}% chance for extra potion on upgrade</h5>' +
                        '     <h5>+ {{userItemToSell.DiscoveryCDReductionPercentage}}% discovery cooldown reduction</h5>' +
                        '     <h5>+ {{userItemToSell.TraderDiscountPercentage}}% trader discount</h5> ' +
                        '     <h5>+ {{userItemToSell.ExtraPotionOnQuest}} potion per solved quest</h5>' +
                        '     <h5>+ {{userItemToSell.ExtraGoldOnDiscovery}} extra gold on discovery</h5>' +
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
        //$cordovaNativeAudio.play('moneySound');
        $scope.traderImage = 'TraderReaction.png'
        $timeout(function () {
            $scope.traderImage = 'Trader.png';
        }, 500);

        var user = $scope.user;
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

        user.AmountOfGold += item.Price;
        databaseFunctions.updateAllUserData($cordovaSQLite, user);
        // The item is deleted from database, now remove it from the current loaded user structure as well
        user.OwnedItems.splice(soldItemIndex, 1);
    };
});