myApp.factory('databaseFunctions', function ($cordovaSQLite, $q) {

    // Private GET helper, you should not need these
    this.executeQuery = function (query, parameters) {
        var q = $q.defer();
        parameters = parameters || []; // Use empty field in case no parameters are used
        $cordovaSQLite.execute(db, query, parameters).then(
            // Query execute was successfull (positive promise)
            function (result) {
                q.resolve(result);
            },
            // Query execute failed (negative promise)
            function (error) {
                q.reject(error);
            });
        return q.promise;
    };

    this.getAllQuestsWithoutAnyTableJoin = function ($cordovaSQLite) {
        var allExistingQuests = [];
        var query = 'SELECT * from Quest_Table';
        return this.executeQuery(query, []).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var questValues = {
                        ID: null,
                        Name: null,
                        Description: null,
                        Rewardmoney: null,
                        Type: null,
                        RewardPotions: [],
                        RequiredPotions:[],
                        Discoveries: []
                    };
                    questValues.ID = result.rows.item(i).ID;
                    questValues.Name = result.rows.item(i).Name;
                    questValues.Description = result.rows.item(i).Description;
                    questValues.Rewardmoney = result.rows.item(i).Rewardmoney;
                    questValues.Type = result.rows.item(i).Type;
                    allExistingQuests.push(questValues);
                };
            };
            return allExistingQuests;
        });
    };

    this.getDiscoveriesForQuests = function ($cordovaSQLite) {

        var query = 'SELECT * from Discovery_Table join RequiredQuestDiscovery_Table on Discovery_Table.ID = RequiredQuestDiscovery_Table.Discovery_TableID';

        return this.executeQuery(query).then(function (result) {
            var allQuestDiscoveries = [];
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var discoveryValues = {
                        ID: null,
                        Name: null,
                        FunctionName: null,
                        Description: null,
                        questid: null
                    };
                    discoveryValues.ID = result.rows.item(i).ID;
                    discoveryValues.Name = result.rows.item(i).Name;
                    discoveryValues.Description = result.rows.item(i).Description;
                    discoveryValues.FunctionName = result.rows.item(i).FunctionName;
                    discoveryValues.questid = result.rows.item(i).Quest_TableID;
                    allQuestDiscoveries.push(discoveryValues);
                };              
            };
            return allQuestDiscoveries;
        });
    };

    this.getRequiredPotionsForQuests = function ($cordovaSQLite) {
        var allRequiredQuestPotions = [];
        var query = 'SELECT * from Potion_Table join RequiredQuestPotion_Table on Potion_Table.ID = RequiredQuestPotion_Table.Potion_TableID';
        return this.executeQuery(query, []).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var potionValues = {
                        ID: null,
                        Rank: null,
                        Name: null,
                        Description: null,
                        Price: null,
                        Class: null,
                        ImageFilename: null,
                        AmountNeeded: null,
                        questid: null
                    };
                    potionValues.ID = result.rows.item(i).ID;
                    potionValues.Rank = result.rows.item(i).Rank;
                    potionValues.Name = result.rows.item(i).Name;
                    potionValues.Description = result.rows.item(i).Description;
                    potionValues.Price = result.rows.item(i).Price;
                    potionValues.Class = result.rows.item(i).Class;
                    potionValues.ImageFilename = result.rows.item(i).ImageFilename;
                    potionValues.AmountNeeded = result.rows.item(i).AmountNeeded;
                    potionValues.questid = result.rows.item(i).Quest_TableID;
                    allRequiredQuestPotions.push(potionValues);
                };              
            };
            return allRequiredQuestPotions;
        });
    };

    this.getRewardPotionsForQuests = function ($cordovaSQLite) {
        var allRewardQuestPotions = [];
        var query = 'SELECT * from Potion_Table join RewardQuestPotion_Table on Potion_Table.ID = RewardQuestPotion_Table.Potion_TableID';
        return this.executeQuery(query, []).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var potionValues = {
                        ID: null,
                        Rank: null,
                        Name: null,
                        Description: null,
                        Price: null,
                        Class: null,
                        ImageFilename: null,
                        RewardAmount: null,
                        questid: null
                    };
                    potionValues.ID = result.rows.item(i).ID;
                    potionValues.Rank = result.rows.item(i).Rank;
                    potionValues.Name = result.rows.item(i).Name;
                    potionValues.Description = result.rows.item(i).Description;
                    potionValues.Price = result.rows.item(i).Price;
                    potionValues.Class = result.rows.item(i).Class;
                    potionValues.ImageFilename = result.rows.item(i).ImageFilename;
                    potionValues.RewardAmount = result.rows.item(i).RewardAmount;
                    potionValues.questid = result.rows.item(i).Quest_TableID;
                    allRewardQuestPotions.push(potionValues);
                };               
            };
            return allRewardQuestPotions;
        });
    };

    this.getUserWithoutAnyAdditionalData = function ($cordovaSQLite) {
        var userValues = {
            ID: null,
            AmountOfGold: null,
            CurrentLevel: null,
            OwnedPotions: [],
            OwnedItems: [],
            SolvedQuests: [],
            FoundDiscoveries: [],
            DataDiscoveries: [],
            ChanceExtraPotionOnUpgrade: null,
            ExtraPotionOnQuest: null,
            ExtraGoldOnDiscovery: null,
            DiscoveryCDReductionPercentage: null,
            TraderDiscountPercentage: null
        };
        var userID = 1;
        var query = 'SELECT * from User_Table where ID = ?';
        return this.executeQuery(query, [userID]).then(function (result) {
            if (result.rows.length = 1) {            
                userValues.ID = result.rows.item(0).ID;
                userValues.AmountOfGold = result.rows.item(0).AmountOfGold;
                userValues.CurrentLevel = result.rows.item(0).CurrentLevel;
                userValues.ChanceExtraPotionOnUpgrade = result.rows.item(0).ChanceExtraPotionOnUpgrade;
                userValues.ExtraPotionOnQuest = result.rows.item(0).ExtraPotionOnQuest;
                userValues.ExtraGoldOnDiscovery = result.rows.item(0).ExtraGoldOnDiscovery;
                userValues.DiscoveryCDReductionPercentage = result.rows.item(0).DiscoveryCDReductionPercentage;
                userValues.TraderDiscountPercentage = result.rows.item(0).TraderDiscountPercentage;
            };
            return userValues;
        });
    };

    this.getUserSolvedQuestIDs = function ($cordovaSQLite) {
        var solvedQuestIDs = [];
        var userID = 1;
        var query = 'SELECT * from SolvedQuests_Table where User_TableID = ?';
        return this.executeQuery(query, [userID]).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var id = result.rows.item(i).Quest_TableID;
                    solvedQuestIDs.push(id);
                };                
            };
            return solvedQuestIDs;
        });
    };

    this.getUserOwnedPotion = function ($cordovaSQLite) {
        var ownedPotions = [];
        var userID = 1;
        var query = 'SELECT * from Potion_Table join Userpotion_Table on Potion_Table.ID = Userpotion_Table.Potion_TableID where User_TableID = ?';
        return this.executeQuery(query, [userID]).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var potionValues = {
                        ID: null,
                        Rank: null,
                        Name: null,
                        Description: null,
                        Price: null,
                        Class: null,
                        ImageFilename: null,
                        Amount: null
                    };
                    potionValues.ID = result.rows.item(i).ID;
                    potionValues.Rank = result.rows.item(i).Rank;
                    potionValues.Name = result.rows.item(i).Name;
                    potionValues.Description = result.rows.item(i).Description;
                    potionValues.Price = result.rows.item(i).Price;
                    potionValues.Class = result.rows.item(i).Class;
                    potionValues.ImageFilename = result.rows.item(i).ImageFilename;
                    potionValues.Amount = result.rows.item(i).Amount;
                    ownedPotions.push(potionValues);
                };               
            };
            return ownedPotions;
        });
    };
    
    this.getUserFoundDiscoveries = function ($cordovaSQLite) {
        var foundDiscoveries = [];
        var userID = 1;
        var query = 'SELECT * FROM Discovery_Table JOIN FoundDiscoveries_Table on Discovery_Table.ID = FoundDiscoveries_Table.Discovery_TableID where User_TableID = ?';
        return this.executeQuery(query, [userID]).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var foundDiscovery = {
                        ID: null,
                        Name: null,
                        Description: null,
                        AvailabilityDate: null,
                        DiscoveryData: null
                    };
                    foundDiscovery.ID = result.rows.item(i).ID;
                    foundDiscovery.Name = result.rows.item(i).Name;
                    foundDiscovery.Description = result.rows.item(i).Description;
                    foundDiscovery.AvailabilityDate = result.rows.item(i).AvailabilityDate;
                    foundDiscoveries.push(foundDiscovery);
                };                
            };
            return foundDiscoveries;
        });
    };

    this.getUserDiscoveryData = function ($cordovaSQLite) {
        var discoveriesWithData = [];
        var userID = 1;
        var query = 'SELECT * FROM Discovery_Table JOIN UserDiscoveryData_Table on Discovery_Table.ID = UserDiscoveryData_Table.Discovery_TableID where User_TableID = ?';
        return this.executeQuery(query, [userID]).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var discoveryWithData = {
                        ID: null,
                        Name: null,
                        Description: null,
                        DiscoveryData: null
                    };
                    discoveryWithData.ID = result.rows.item(i).ID;
                    discoveryWithData.Name = result.rows.item(i).Name;
                    discoveryWithData.Description = result.rows.item(i).Description;
                    discoveryWithData.DiscoveryData = result.rows.item(i).DiscoveryData;
                    discoveriesWithData.push(discoveryWithData);
                };
            };
            return discoveriesWithData;
        });
    };

    this.getUserOwnedItems = function ($cordovaSQLite) {
        var ownedItems = [];
        var userID = 1;
        var query = 'SELECT * from UserItem_Table where User_TableID = ?';
        return this.executeQuery(query, [userID]).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var ownedItem = {
                        ID: null,
                        Class: null,
                        Price: null,
                        ChanceExtraPotionOnUpgrade: null,
                        ExtraPotionOnQuest: null,
                        ExtraGoldOnDiscovery: null,
                        DiscoveryCDReductionPercentage: null,
                        TraderDiscountPercentage: null,
                        ImageFilename: null,
                        Equipped: null,
                        SellItFlag: false,
                        StoreItFlag: false,
                        UpdateItFlag: false
                    };
                    ownedItem.ID = result.rows.item(i).ID;
                    ownedItem.Class = result.rows.item(i).Class;
                    ownedItem.Price = result.rows.item(i).Price;
                    ownedItem.ChanceExtraPotionOnUpgrade = result.rows.item(i).ChanceExtraPotionOnUpgrade;
                    ownedItem.ExtraPotionOnQuest = result.rows.item(i).ExtraPotionOnQuest;
                    ownedItem.ExtraGoldOnDiscovery = result.rows.item(i).ExtraGoldOnDiscovery;
                    ownedItem.DiscoveryCDReductionPercentage = result.rows.item(i).DiscoveryCDReductionPercentage;
                    ownedItem.TraderDiscountPercentage = result.rows.item(i).TraderDiscountPercentage;
                    ownedItem.ImageFilename = result.rows.item(i).ImageFilename;
                    ownedItem.Equipped = result.rows.item(i).Equipped;
                    ownedItems.push(ownedItem);
                };
            };
            return ownedItems;
        });
    };

    // Private SET helper, you should not need these
    this.updateUserpotions = function ($cordovaSQLite, userData) {
        var insert_userpotions_query = 'INSERT OR IGNORE INTO Userpotion_Table (User_TableID, Potion_TableID) VALUES (?, ?)';  // the IGNORE only works on primary key or unique constraints
        var update_userpotions_query = 'UPDATE Userpotion_Table SET Amount = ? WHERE User_TableID = ? AND Potion_TableID = ?';
        var delete_userpotions_query = 'DELETE FROM Userpotion_Table WHERE User_TableID = ? AND Potion_TableID = ?';
        var potionTableLength = 0;
        if (typeof userData.OwnedPotions != 'undefined') {
            potionTableLength += userData.OwnedPotions.length;
        };
        for (var i = 0; i < potionTableLength; i++) {
            var userID = userData.ID;
            var potionID = userData.OwnedPotions[i].ID;
            var potionAmount = userData.OwnedPotions[i].Amount;
            if (potionAmount > 0) {
                $cordovaSQLite.execute(db, insert_userpotions_query, [userID, potionID]);
                $cordovaSQLite.execute(db, update_userpotions_query, [potionAmount, userID, potionID]);
            } else {
                $cordovaSQLite.execute(db, delete_userpotions_query, [userID, potionID]);
            };
        };
    };

    this.updateSolvedQuests = function ($cordovaSQLite, userData) {
        var insert_userquests_query = 'INSERT OR IGNORE INTO SolvedQuests_Table (User_TableID, Quest_TableID) VALUES (?, ?)';
        var userID = userData.ID;
        var questCount = 0;
        if (typeof userData.SolvedQuests != 'undefined') {
            questCount += userData.SolvedQuests.length;
        };
        for (var i = 0; i < questCount; i++) {
            var solvedQuestID = userData.SolvedQuests[i].ID;
            $cordovaSQLite.execute(db, insert_userquests_query, [userID, solvedQuestID]);
        };
    };

    this.updateFoundDiscoveries = function ($cordovaSQLite, userData) {
        var insert_discovery_query = "INSERT INTO FoundDiscoveries_Table (User_TableID, Discovery_TableID, AvailabilityDate) VALUES (?, ?, ?)";
        var update_discovery_query = "UPDATE FoundDiscoveries_Table SET AvailabilityDate = ? where User_TableID = ? AND Discovery_TableID = ?"
        var userDiscoveries = userData.FoundDiscoveries;
        var userID = userData.ID;
        var discoveryCount = 0;
        if (typeof userDiscoveries != 'undefined') {
            discoveryCount += userDiscoveries.length;
        };
        for (var x = 0; x < discoveryCount; x++) {
            var discoveryID = userDiscoveries[x].ID;
            $cordovaSQLite.execute(db, insert_discovery_query, [userID, discoveryID, userDiscoveries[x].AvailabilityDate]);
            $cordovaSQLite.execute(db, update_discovery_query, [userDiscoveries[x].AvailabilityDate, userID, discoveryID]);
        };
    };

    this.updateUserDiscoveryData = function ($cordovaSQLite, userData) {
        var insert_discoveryData_query = "INSERT INTO UserDiscoveryData_Table (User_TableID, Discovery_TableID, DiscoveryData) VALUES (?, ?, ?)";
        var update_discoveryData_query = "UPDATE UserDiscoveryData_Table SET DiscoveryData = ? where User_TableID = ? AND Discovery_TableID = ?"
        var userDiscoveryData = userData.DataForDiscoveries;
        var userID = userData.ID;
        var discoveryCount = 0;
        if (typeof userDiscoveryData != 'undefined') {
            discoveryCount += userDiscoveryData.length;
        };
        for (var x = 0; x < discoveryCount; x++) {
            var discoveryID = userDiscoveryData[x].ID;
            $cordovaSQLite.execute(db, insert_discoveryData_query, [userID, discoveryID, userDiscoveryData[x].DiscoveryData]);
            $cordovaSQLite.execute(db, update_discoveryData_query, [userDiscoveryData[x].DiscoveryData, userID, discoveryID]);
        };

    };

    this.updateUserItems = function ($cordovaSQLite, userData) {      
        var insert_items_query = "INSERT INTO UserItem_Table (User_TableID, Class, Price, ChanceExtraPotionOnUpgrade, ExtraPotionOnQuest, ExtraGoldOnDiscovery, DiscoveryCDReductionPercentage, TraderDiscountPercentage, ImageFilename, Equipped) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var delete_items_query = "DELETE FROM UserItem_Table where ID = ?";
        var update_items_query = "UPDATE UserItem_Table set Equipped = ? where ID = ?";
        var userItems = userData.OwnedItems;
        var userID = userData.ID;
        var itemCount = 0;
        if (typeof userItems != 'undefined') {
            itemCount += userItems.length;
        };

        for (var x = 0; x < itemCount; x++) {
            var itemID = userItems[x].ID;
            if (userItems[x].StoreItFlag == true) {
                $cordovaSQLite.execute(db, insert_items_query,
                    [userID, userItems[x].Class, userItems[x].Price, userItems[x].ChanceExtraPotionOnUpgrade, userItems[x].ExtraPotionOnQuest,
                        userItems[x].ExtraGoldOnDiscovery, userItems[x].DiscoveryCDReductionPercentage, userItems[x].TraderDiscountPercentage, userItems[x].ImageFilename, userItems[x].Equipped]);
            } else if (userItems[x].SellItFlag == true) {
                $cordovaSQLite.execute(db, delete_items_query, [itemID]);
            } else if (userItems[x].UpdateItFlag == true) {
                $cordovaSQLite.execute(db, update_items_query, [userItems[x].Equipped, itemID]);
            };
        };
    };

    // Functions to get the db data
    this.getAllExistingDiscoveries = function ($cordovaSQLite) {
        var allExistingDiscoveries = [];
        var query = 'SELECT * from Discovery_Table';
        return this.executeQuery(query, []).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var discoveryValues = {
                        ID: null,
                        Name: null,
                        Description: null
                    };
                    discoveryValues.ID = result.rows.item(i).ID;
                    discoveryValues.Name = result.rows.item(i).Name;
                    discoveryValues.Description = result.rows.item(i).Description;
                    allExistingDiscoveries.push(discoveryValues);
                };
            };
            return allExistingDiscoveries;
        });
    };

    this.getAllExistingPotions = function ($cordovaSQLite) {
        var allExistingPotions = [];
        var query = 'SELECT * from Potion_Table';
        return this.executeQuery(query, []).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var potionValues = {
                        ID: null,
                        Rank: null,
                        Name: null,
                        Description: null,
                        Price: null,
                        Class: null,
                        ImageFilename: null,
                    };
                    potionValues.ID = result.rows.item(i).ID;
                    potionValues.Rank = result.rows.item(i).Rank;
                    potionValues.Name = result.rows.item(i).Name;
                    potionValues.Description = result.rows.item(i).Description;
                    potionValues.Price = result.rows.item(i).Price;
                    potionValues.Class = result.rows.item(i).Class;
                    potionValues.ImageFilename = result.rows.item(i).ImageFilename;
                    allExistingPotions.push(potionValues);
                };
            };
            return allExistingPotions;
        });     
    };

    this.getAllExistingQuests = function ($cordovaSQLite) {

        var quests = this.getAllQuestsWithoutAnyTableJoin($cordovaSQLite);
        var questDiscoveries = this.getDiscoveriesForQuests($cordovaSQLite);
        var requiredQuestPotions = this.getRequiredPotionsForQuests($cordovaSQLite);
        var rewardQuestPotions = this.getRewardPotionsForQuests($cordovaSQLite);

        return $q.all([quests, questDiscoveries, requiredQuestPotions, rewardQuestPotions]).then(function (dataset) {
            // quests and questDiscoveries are in the dataset, returned as the resolve value of $q.all().
            // If not clear why quests variable CAN be used and data shown, but NOT accessed via quests[0] (so we have to use data[0] instead), check tutorial for angularjs promises
            accessibleQuests = dataset[0];
            accessibleDiscoveries = dataset[1];
            accessibleRequiredQuestPotions = dataset[2];
            accessibleRewardQuestPotions = dataset[3];

            // Add discoveries to quests. If Quest1 has Discovery1 and Discovery2 they will be added to it via Quest1.Discoveries.push(Discovery1), Quest1.Discoveries.push(Discovery2)
            for (var i = 0; i < accessibleQuests.length; i++) {
                var questDiscoveries = [];
                for (var x = 0; x < accessibleDiscoveries.length; x++) {
                    var discoveryWithoutQuestId = {
                        ID: null,
                        Name: null,
                        Description: null
                    };
                    if (accessibleDiscoveries[x].questid == accessibleQuests[i].ID) {
                        discoveryWithoutQuestId.ID = accessibleDiscoveries[x].ID;
                        discoveryWithoutQuestId.Name = accessibleDiscoveries[x].Name;
                        discoveryWithoutQuestId.Description = accessibleDiscoveries[x].Description;
                        accessibleQuests[i].Discoveries.push(discoveryWithoutQuestId);
                    };
                };
            };


            // Add the required potions to each quest
            for (var i = 0; i < accessibleQuests.length; i++) {
                for (var x = 0; x < accessibleRequiredQuestPotions.length; x++) {
                    var requiredPotionWithoutQuestId = {
                        ID: null,
                        Rank: null,
                        Name: null,
                        Description: null,
                        Price: null,
                        Class: null,
                        ImageFilename: null,
                        AmountNeeded: null
                    };
                    if (accessibleRequiredQuestPotions[x].questid == accessibleQuests[i].ID) {
                        requiredPotionWithoutQuestId.ID = accessibleRequiredQuestPotions[x].ID;
                        requiredPotionWithoutQuestId.Rank = accessibleRequiredQuestPotions[x].Rank;
                        requiredPotionWithoutQuestId.Name = accessibleRequiredQuestPotions[x].Name;
                        requiredPotionWithoutQuestId.Description = accessibleRequiredQuestPotions[x].Description;
                        requiredPotionWithoutQuestId.Price = accessibleRequiredQuestPotions[x].Price;
                        requiredPotionWithoutQuestId.Class = accessibleRequiredQuestPotions[x].Class;
                        requiredPotionWithoutQuestId.ImageFilename = accessibleRequiredQuestPotions[x].ImageFilename;
                        requiredPotionWithoutQuestId.AmountNeeded = accessibleRequiredQuestPotions[x].AmountNeeded;
                        accessibleQuests[i].RequiredPotions.push(requiredPotionWithoutQuestId);
                    };
                };
            };

            // Add the reward potions to each quest
            for (var i = 0; i < accessibleQuests.length; i++) {
                for (var x = 0; x < accessibleRewardQuestPotions.length; x++) {
                    var rewardPotionWithoutQuestId = {
                        ID: null,
                        Rank: null,
                        Name: null,
                        Description: null,
                        Price: null,
                        Class: null,
                        ImageFilename: null,
                        RewardAmount: null
                    };
                    if (accessibleRewardQuestPotions[x].questid == accessibleQuests[i].ID) {
                        rewardPotionWithoutQuestId.ID = accessibleRewardQuestPotions[x].ID;
                        rewardPotionWithoutQuestId.Rank = accessibleRewardQuestPotions[x].Rank;
                        rewardPotionWithoutQuestId.Name = accessibleRewardQuestPotions[x].Name;
                        rewardPotionWithoutQuestId.Description = accessibleRewardQuestPotions[x].Description;
                        rewardPotionWithoutQuestId.Price = accessibleRewardQuestPotions[x].Price;
                        rewardPotionWithoutQuestId.Class = accessibleRewardQuestPotions[x].Class;
                        rewardPotionWithoutQuestId.ImageFilename = accessibleRewardQuestPotions[x].ImageFilename;
                        rewardPotionWithoutQuestId.RewardAmount = accessibleRewardQuestPotions[x].RewardAmount;
                        accessibleQuests[i].RewardPotions.push(rewardPotionWithoutQuestId);
                    };
                };
            };

            return accessibleQuests;
        });
    };
  
    this.getUser = function ($cordovaSQLite) {
        var user = this.getUserWithoutAnyAdditionalData($cordovaSQLite);
        var allQuests = this.getAllExistingQuests($cordovaSQLite);
        var solvedQuestIDs = this.getUserSolvedQuestIDs($cordovaSQLite);
        var ownedPotions = this.getUserOwnedPotion($cordovaSQLite);
        var foundDiscoveries = this.getUserFoundDiscoveries($cordovaSQLite);
        var discoveryData = this.getUserDiscoveryData($cordovaSQLite);
        var ownedItems = this.getUserOwnedItems($cordovaSQLite);

        return $q.all([user, allQuests, solvedQuestIDs, ownedPotions, foundDiscoveries, discoveryData, ownedItems]).then(function (dataset) {
            var set_user = dataset[0];
            var set_allQuests = dataset[1];
            var set_solvedQuestIDs = dataset[2];
            var set_ownedPotions = dataset[3];
            var set_foundDiscoveries = dataset[4];
            var set_discoveryData = dataset[5];
            var set_ownedItems = dataset[6];

            // Filter out the solved quests from the list of all quests
            for (var i = 0; i < set_allQuests.length; i++) {
                for (var x = 0; x < set_solvedQuestIDs.length; x++) {
                    if (set_allQuests[i].ID == set_solvedQuestIDs[x]) {
                        set_user.SolvedQuests.push(set_allQuests[i]);
                    };
                };
            };

            // Get the potions the user owns
            set_user.OwnedPotions = set_ownedPotions;

            // Get the discoveries the user owns
            set_user.FoundDiscoveries = set_foundDiscoveries;

            // Get the discoveryData for the user
            set_user.DataForDiscoveries = set_discoveryData;

            // Get the items the user owns
            set_user.OwnedItems = set_ownedItems;

            return set_user;
        });
    };

    // Functions to update the db data    
    this.updateAllUserData = function ($cordovaSQLite, userData) {
        // Update the User_Table
        var update_user_query = 'UPDATE User_Table SET AmountOfGold = ?, CurrentLevel = ?, ChanceExtraPotionOnUpgrade = ?, ExtraPotionOnQuest = ?, ExtraGoldOnDiscovery = ?, DiscoveryCDReductionPercentage = ?, TraderDiscountPercentage = ? WHERE ID = ?';
        this.executeQuery(update_user_query, [userData.AmountOfGold, userData.CurrentLevel, userData.ChanceExtraPotionOnUpgrade, userData.ExtraPotionOnQuest, userData.ExtraGoldOnDiscovery, userData.DiscoveryCDReductionPercentage, userData.TraderDiscountPercentage, userData.ID]);

        this.updateUserpotions($cordovaSQLite, userData);
        this.updateSolvedQuests($cordovaSQLite, userData);
        this.updateFoundDiscoveries($cordovaSQLite, userData);
        this.updateUserDiscoveryData($cordovaSQLite, userData);
        this.updateUserItems($cordovaSQLite, userData);
    };

    return this;
});