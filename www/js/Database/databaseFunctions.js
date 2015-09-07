myApp.factory('databaseFunctions', function ($cordovaSQLite, $q) {

    // Private helper, you should not need these
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
                return allQuestDiscoveries;
            };
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
                return allRequiredQuestPotions;
            };
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
                return allRewardQuestPotions;
            };
        });
    };

    this.getUserWithoutAnyAdditionalData = function ($cordovaSQLite) {
        var userValues = {
            ID: null,
            AmountOfGold: null,
            CurrentLevel: null,
            OwnedPotions: [],
            SolvedQuests: []
        };
        var userID = 1;
        var query = 'SELECT * from User_Table where ID = ?';
        return this.executeQuery(query, [userID]).then(function (result) {
            if (result.rows.length = 1) {            
                userValues.ID = result.rows.item(0).ID;
                userValues.AmountOfGold = result.rows.item(0).AmountOfGold;
                userValues.CurrentLevel = result.rows.item(0).CurrentLevel;         
                return userValues;
            };
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
                return solvedQuestIDs;
            };         
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
                return ownedPotions;
            };
        });
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
                        FunctionName: null,
                        Description: null
                    };
                    discoveryValues.ID = result.rows.item(i).ID;
                    discoveryValues.Name = result.rows.item(i).Name;
                    discoveryValues.Description = result.rows.item(i).Description;
                    discoveryValues.FunctionName = result.rows.item(i).FunctionName;
                    allExistingDiscoveries.push(discoveryValues);
                };
                return discoveryValues;
            };
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
                        FunctionName: null,
                        Description: null
                    };
                    if (accessibleDiscoveries[x].questid == accessibleQuests[i].ID) {
                        discoveryWithoutQuestId.ID = accessibleDiscoveries[x].ID;
                        discoveryWithoutQuestId.Name = accessibleDiscoveries[x].Name;
                        discoveryWithoutQuestId.FunctionName = accessibleDiscoveries[x].FunctionName;
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

        return $q.all([user, allQuests, solvedQuestIDs, ownedPotions]).then(function (dataset) {
            var set_user = dataset[0];
            var set_allQuests = dataset[1];
            var set_solvedQuestIDs = dataset[2];
            var set_ownedPotions = dataset[3];

            
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

            return set_user;
        });
    };

    // Functions to update the db data    
    this.updateAllUserData = function ($cordovaSQLite, userData) {

        // Update the User_Table
        var userID = 1;
        var update_user_query = 'UPDATE User_Table SET AmountOfGold = ?, CurrentLevel = ? WHERE ID = ?';
        this.executeQuery(update_user_query, [userData.AmountOfGold, userData.CurrentLevel, userID]);

        // Update the Userpotion_Table
        var userID = 1;
        var delete_userpotions_query = 'DELETE FROM Userpotion_Table WHERE User_TableID = ?';
        var insert_userpotions_query = 'INSERT INTO Userpotion_Table (User_TableID, Potion_TableID, Amount) VALUES (?, ?, ?)';       
        this.executeQuery(delete_userpotions_query, [userID]).then(function (result) {
            for (var i = 0; i < userData.OwnedPotions.length; i++) {
                if (userData.OwnedPotions[i].Amount > 0) {
                    $cordovaSQLite.execute(db, insert_userpotions_query, [userID, userData.OwnedPotions[i].ID, userData.OwnedPotions[i].Amount]);
                };
            };
        });       
       
        // Update the SolvedQuests_Table
        var delete_userquests_query = 'DELETE FROM SolvedQuests_Table WHERE User_TableID = ?';
        var insert_userquests_query = 'INSERT INTO SolvedQuests_Table (User_TableID, Quest_TableID) VALUES (?, ?)';
        this.executeQuery(delete_userquests_query, [userData]).then(function (result) {
            for (var i = 0; i < userData.SolvedQuests.length; i++) {
                $cordovaSQLite.execute(db, insert_userquests_query, [userID, userData.SolvedQuests[i].ID]);
            };
        });
    };

    return this;
});