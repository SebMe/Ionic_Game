myApp.factory('itemService', function ($cordovaSQLite, $q, $ionicPopup) {
	this.createItem = function(Class){
		var imageFilename;

		var newItem = {
			ID: null,
			Class: Class.Class,
			Name: Class.Name,
			Price: 500,
			ChanceExtraPotionOnUpgrade: Math.round(Math.random() * 100) % 8 + 3,   // 3-10
			ExtraPotionOnQuest: Math.round(Math.random() * 100) % 2 + 1,    // 1-2
			ExtraGoldOnDiscovery: (Math.round(Math.random() * 100) % 5 + 1) * 100,    // 100-500
			DiscoveryCDReductionPercentage: Math.round(Math.random() * 100) % 8 + 3,   // 3-10
			TraderDiscountPercentage: Math.round(Math.random() * 100) % 8 + 3, //3-10
			ImageFilename: Class.ImageFilename,
			Equipped: 'false',
			SellItFlag: false,
			StoreItFlag: true,
			UpdateItFlag: false
		};
		return newItem;
	};
	
	
	this.showItemPopup = function(scope, item){	
		scope.rolledItem = item;
		scope.itemPopup = $ionicPopup.show({
			template:
					'<style>.popup {min-width:90%;} .popup-body{ background-color: #c8c8c8} .popup-head{ background-color: #ffb90f}</style>' +
					'<div ng-click=closeItemPopup()>' +
					'<img src="img/{{rolledItem.ImageFilename}}" style="margin-right:15%;" >' +
					'     <h5>+ {{rolledItem.ChanceExtraPotionOnUpgrade}}% chance for extra potion on upgrade</h5>' +
					'     <h5>+ {{rolledItem.DiscoveryCDReductionPercentage}}% discovery cooldown reduction</h5>' +
					'     <h5>+ {{rolledItem.TraderDiscountPercentage}}% trader discount</h5> ' +
					'     <h5>+ {{rolledItem.ExtraPotionOnQuest}} potion per solved quest</h5>' +
					'     <h5>+ {{rolledItem.ExtraGoldOnDiscovery}} extra gold on discovery</h5>'+
					'</div>',
			title: item.Name,
			scope: scope
		});
		
		scope.closeItemPopup = function () {
			scope.itemPopup.close();
		};
	};
	
	this.getAllItemClasses = function(traderDiscountPercentage){
		var itemPriceAdjustedToDiscount= 5000 - Math.round(5000 * traderDiscountPercentage / 100);
        var classHead = { Class: 'Head', Price: itemPriceAdjustedToDiscount, ImageFilename: 'Hat.png', Name: 'Hat' };
        var classNeck = { Class: 'Neck', Price: itemPriceAdjustedToDiscount, ImageFilename: 'Amulett.png', Name: 'Amulett' };
        var classBody = { Class: 'Body', Price: itemPriceAdjustedToDiscount, ImageFilename: 'Coat.png', Name: 'Coat' };
        var classMainHand = { Class: 'MainHand', Price: itemPriceAdjustedToDiscount, ImageFilename: 'Wand.png', Name: 'Wand' };
        var classOffHand = { Class: 'OffHand', Price: itemPriceAdjustedToDiscount, ImageFilename: 'Ring.png', Name: 'Ring' };
        var classFeet = { Class: 'Feet', Price: itemPriceAdjustedToDiscount, ImageFilename: 'Boots.png', Name: 'Boots' };

        var itemClassesToBuy = [classHead, classNeck, classBody, classMainHand, classOffHand, classFeet];
		return itemClassesToBuy;
	};
	
	return this;
});