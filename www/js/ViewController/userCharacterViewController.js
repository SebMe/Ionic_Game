myApp.controller('userCharacterViewController', function ($scope, $cordovaSQLite, $ionicPopup, databaseFunctions) {
    $scope.$on('$ionicView.enter', function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (user) {
            $scope.user = user;
            for (var i = 0; i < user.OwnedItems.length; i++) {
                if (user.OwnedItems[i].Equipped == 'true') {
                    user.OwnedItems[i].BackgroundColor = 'limegreen';
                };
            };

            resetImagesToDefaultIfNoItemEquipped();
        });
    });

    var resetImagesToDefaultIfNoItemEquipped = function () {
        var user = $scope.user;

        $scope.headItemImageFilename = null;
        $scope.neckItemImageFilename = null;
        $scope.mainHandItemImageFilename = null;
        $scope.bodyItemImageFilename = null;
        $scope.offHandItemImageFilename = null;
        $scope.feetItemImageFilename = null;

        var equippedItem = getEquippedItemForClass(user, 'Head');
        if (equippedItem != null) {
            $scope.headItemImageFilename = equippedItem.ImageFilename;
        };

        equippedItem = getEquippedItemForClass(user, 'Neck');
        if (equippedItem != null) {
            $scope.neckItemImageFilename = equippedItem.ImageFilename;
        };

        equippedItem = getEquippedItemForClass(user, 'MainHand');
        if (equippedItem != null) {
            $scope.mainHandItemImageFilename = equippedItem.ImageFilename;
        };

        equippedItem = getEquippedItemForClass(user, 'Body');
        if (equippedItem != null) {
            $scope.bodyItemImageFilename = equippedItem.ImageFilename;
        };

        equippedItem = getEquippedItemForClass(user, 'OffHand');
        if (equippedItem != null) {
            $scope.offHandItemImageFilename = equippedItem.ImageFilename;
        };

        equippedItem = getEquippedItemForClass(user, 'Feet');
        if (equippedItem != null) {
            $scope.feetItemImageFilename = equippedItem.ImageFilename;
        };
    };

    var getEquippedItemForClass = function (user, Class) {
        for (var i = 0; i < user.OwnedItems.length; i++) {
            if (user.OwnedItems[i].Class == Class && user.OwnedItems[i].Equipped == 'true') {
                return user.OwnedItems[i];
            };
        };
        return null;
    };

    $scope.showSelection = function (Class) {
        $scope.Class = Class;
        $scope.itemListPopup = $ionicPopup.show({
            template:
                    '<style>.popup {min-width:50%;} .popup-head{ background-color: #ffb90f}</style>'+
                     '<ion-list>                                ' +
                    '  <ion-item ng-repeat="item in user.OwnedItems |filter: class= Class" style="background-color: {{item.BackgroundColor || \'#c8c8c8\'}}"; ng-click = equipItem(item)>' +
                                 '<img src="img/{{item.ImageFilename}}" style="margin-right:60%"; >' +
                            '     <h4 ng-show="{{item.ChanceExtraPotionOnUpgrade}}">+ {{item.ChanceExtraPotionOnUpgrade}}% chance for extra potion on upgrade</h4>' +
                            '     <h4 ng-show="{{item.DiscoveryCDReductionPercentage}}">+ {{item.DiscoveryCDReductionPercentage}}% discovery cooldown reduction</h4>' +
                            '     <h4 ng-show="{{item.TraderDiscountPercentage}}">+ {{item.TraderDiscountPercentage}}% trader discount</h4> ' +
                            '     <h4 ng-show="{{item.ExtraPotionOnQuest}}">+ {{item.ExtraPotionOnQuest}} potion per solved quest</h4>' +
                            '     <h4 ng-show="{{item.ExtraGoldOnDiscovery}}">+ {{item.ExtraGoldOnDiscovery}} extra gold on discovery</h4>' +
                    '  </ion-item>' +
                      '</ion-list>',

            title: 'Equip item',
            scope: $scope,
            buttons: [
              { text: 'Back' }
            ]
        });
    };
    
    $scope.equipItem = function (item) {
        var user = $scope.user;     
        var itemIndex = getUserItemIndexForID(user, item.ID);

        if (item.Class == 'Head') {
            $scope.headItemImageFilename = item.ImageFilename;
        } else if (item.Class == 'Neck') {
            $scope.neckItemImageFilename = item.ImageFilename;
        } else if (item.Class == 'MainHand') {
            $scope.mainHandItemImageFilename = item.ImageFilename;
        } else if (item.Class == 'Body') {
            $scope.bodyItemImageFilename = item.ImageFilename;
        } else if (item.Class == 'OffHand') {
            $scope.offHandItemImageFilename = item.ImageFilename;
        } else if (item.Class == 'Feet') {
            $scope.feetItemImageFilename = item.ImageFilename;
        };

        unequipItemForClassIfEquipped(item.Class, user);
        user.OwnedItems[itemIndex].Equipped = 'true';
        user.OwnedItems[itemIndex].UpdateItFlag = true;
        user.OwnedItems[itemIndex].BackgroundColor = 'limegreen';

        user.ChanceExtraPotionOnUpgrade += user.OwnedItems[itemIndex].ChanceExtraPotionOnUpgrade;
        user.ExtraPotionOnQuest += user.OwnedItems[itemIndex].ExtraPotionOnQuest;
        user.ExtraGoldOnDiscovery += user.OwnedItems[itemIndex].ExtraGoldOnDiscovery;
        user.DiscoveryCDReductionPercentage += user.OwnedItems[itemIndex].DiscoveryCDReductionPercentage;
        user.TraderDiscountPercentage += user.OwnedItems[itemIndex].TraderDiscountPercentage;
        $scope.user = user;

        databaseFunctions.updateAllUserData($cordovaSQLite, user);
    };

    var unequipItemForClassIfEquipped = function (Class, user) {
        for (var i = 0; i < user.OwnedItems.length; i++) {
            if (user.OwnedItems[i].Class == Class && user.OwnedItems[i].Equipped == 'true') {
                user.OwnedItems[i].Equipped = 'false';
                user.OwnedItems[i].UpdateItFlag = true;
                user.OwnedItems[i].BackgroundColor = null;

                user.ChanceExtraPotionOnUpgrade -= user.OwnedItems[i].ChanceExtraPotionOnUpgrade;
                user.ExtraPotionOnQuest -= user.OwnedItems[i].ExtraPotionOnQuest;
                user.ExtraGoldOnDiscovery -= user.OwnedItems[i].ExtraGoldOnDiscovery;
                user.DiscoveryCDReductionPercentage -= user.OwnedItems[i].DiscoveryCDReductionPercentage;
                user.TraderDiscountPercentage -= user.OwnedItems[i].TraderDiscountPercentage;
            };
        };
    };

    var getUserItemIndexForID = function (user, ID) {
        for (var i = 0; i < user.OwnedItems.length; i++) {
            if (user.OwnedItems[i].ID == ID) {
                return i;
            };
        };
        return -1;
    };

});