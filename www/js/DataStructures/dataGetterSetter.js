myApp.factory('dataGetterSetter', function ($cordovaSQLite, $q) {

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

    this.getAllQuestsWithoutDiscoveryAndRewardPotion = function ($cordovaSQLite) {
        var allExistingQuests = [];
        var query = 'SELECT * from Quest_Table';
        return this.executeQuery(query, []).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var questValues = {
                        id: null,
                        Name: null,
                        Description: null,
                        Rewardmoney: null,
                        Type: null,
                        RewardPotion: [],
                        Discoveries: []
                    };
                    questValues.id = result.rows.item(i).id;
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

        var query = 'SELECT * from Discovery_Table join RequiredQuestDiscovery_Table on Discovery_Table.id = RequiredQuestDiscovery_Table.discovery_tableID';

        return this.executeQuery(query).then(function (result) {
            var allQuestDiscoveries = [];
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var discoveryValues = {
                        id: null,
                        Name: null,
                        FunctionName: null,
                        Description: null,
                        questid: null
                    };
                    discoveryValues.id = result.rows.item(i).id;
                    discoveryValues.Name = result.rows.item(i).Name;
                    discoveryValues.Description = result.rows.item(i).Description;
                    discoveryValues.FunctionName = result.rows.item(i).FunctionName;
                    discoveryValues.questid = result.rows.item(i).quest_tableID;
                    allQuestDiscoveries.push(discoveryValues);
                };
                return allQuestDiscoveries;
            };
        });
    };

    this.getPotionsForQuests = function ($cordovaSQLite) {
        var allQuestPotions = [];
        var query = 'SELECT * from Potion_Table join RequiredQuestPotion_Table on Potion_Table.id = RequiredQuestPotion_Table.potion_tableID';
        return this.executeQuery(query, []).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var potionValues = {
                        id: null,
                        Rank: null,
                        Name: null,
                        Description: null,
                        Price: null,
                        Class: null,
                        ImageFilename: null,
                        Amount: null,
                        questid: null
                    };
                    potionValues.id = result.rows.item(i).id;
                    potionValues.Rank = result.rows.item(i).Rank;
                    potionValues.Name = result.rows.item(i).Name;
                    potionValues.Description = result.rows.item(i).Description;
                    potionValues.Price = result.rows.item(i).Price;
                    potionValues.Class = result.rows.item(i).Class;
                    potionValues.ImageFilename = result.rows.item(i).ImageFilename;
                    potionValues.Amount = result.rows.item(i).AmountNeeded;
                    potionValues.questid = result.rows.item(i).quest_tableID;
                    allQuestPotions.push(potionValues);
                };
                return allQuestPotions;
            };
        });
    };

    this.getUserWithoutAnyAdditionalData = function ($cordovaSQLite) {
        var userValues = {
            id: null,
            AmountOfGold: null,
            CurrentLevel: null,
            OwnedPotions: [],
            SolvedQuests: []
        };
        var query = 'SELECT * from User_Table where id = 1';
        return this.executeQuery(query, []).then(function (result) {
            if (result.rows.length = 1) {            
                userValues.id = result.rows.item(0).id;
                userValues.AmountOfGold = result.rows.item(0).AmountOfGold;
                userValues.CurrentLevel = result.rows.item(0).CurrentLevel;         
                return userValues;
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
                        id: null,
                        Name: null,
                        FunctionName: null,
                        Description: null
                    };
                    discoveryValues.id = result.rows.item(i).id;
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
                        id: null,
                        Rank: null,
                        Name: null,
                        Description: null,
                        Price: null,
                        Class: null,
                        ImageFilename: null,
                    };
                    potionValues.id = result.rows.item(i).id;
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
        
        var quests = this.getAllQuestsWithoutDiscoveryAndRewardPotion($cordovaSQLite);
        var questDiscoveries = this.getDiscoveriesForQuests($cordovaSQLite);
        var questPotions = this.getPotionsForQuests($cordovaSQLite);


        return $q.all([quests, questDiscoveries, questPotions]).then(function (dataset) {
            // quests and questDiscoveries are in the dataset, returned as the resolve value of $q.all().
            // If not clear why quests variable CAN be used and data shown, but NOT accessed via quests[0] (so we have to use data[0] instead), check tutorial for angularjs promises
            accessibleQuests = dataset[0];
            accessibleDiscoveries = dataset[1];
            accessibleQuestPotions = dataset[2];

            var discoveryWithoutQuestId = {
                id: null,
                Name: null,
                FunctionName: null,
                Description: null
            };
            
            // Add discoveries to quests. If Quest1 has Discovery1 and Discovery2 they will be added to it via Quest1.Discoveries.push(Discovery1), Quest1.Discoveries.push(Discovery2)
            for (var i = 0; i < accessibleQuests.length; i++) {
                var questDiscoveries = [];
                for (var x = 0; x < accessibleDiscoveries.length; x++) {
                    if (accessibleDiscoveries[x].questid == accessibleQuests[i].id) {
                        discoveryWithoutQuestId.id = accessibleDiscoveries[x].id;
                        discoveryWithoutQuestId.Name = accessibleDiscoveries[x].Name;
                        discoveryWithoutQuestId.FunctionName = accessibleDiscoveries[x].FunctionName;
                        discoveryWithoutQuestId.Description = accessibleDiscoveries[x].Description;
                        accessibleQuests[i].Discoveries.push(discoveryWithoutQuestId);
                    };
                };
            };

            
            // Add the reward potion to each quest, if it has one
            for (var i = 0; i < accessibleQuests.length; i++) {
                var rewardPotionWithoutQuestId = {
                    id: null,
                    Rank: null,
                    Name: null,
                    Description: null,
                    Price: null,
                    Class: null,
                    ImageFilename: null,
                };
                for (var x = 0; x < accessibleQuestPotions.length; x++) {
                    if (accessibleQuestPotions[x].questid == accessibleQuests[i].id) {
                        rewardPotionWithoutQuestId.id = accessibleQuestPotions[x].id;
                        rewardPotionWithoutQuestId.Rank = accessibleQuestPotions[x].Rank;
                        rewardPotionWithoutQuestId.Name = accessibleQuestPotions[x].Name;
                        rewardPotionWithoutQuestId.Description = accessibleQuestPotions[x].Description;
                        rewardPotionWithoutQuestId.Price = accessibleQuestPotions[x].Price;
                        rewardPotionWithoutQuestId.Class = accessibleQuestPotions[x].Class;
                        rewardPotionWithoutQuestId.ImageFilename = accessibleQuestPotions[x].ImageFilename;
                        accessibleQuests[i].RewardPotion.push(rewardPotionWithoutQuestId);
                    };
                };
            };
    
            return accessibleQuests;
        });
    };
  /*
    this.getUser = function (user_id, $cordovaSQLite) {
        var accessibleUser = this.getUserWithoutAnyAdditionalData($cordovaSQLite);
        var allQuests = 
        return $q.all([user]).then(function (dataset) {

            return dataset;
        });

    };*/
    this.getUser2 = function (user_id, $cordovaSQLite) {

        var userValues = {
            id: null,
            AmountOfGold: null,
            CurrentLevel: null,
            OwnedPotions: [],
            SolvedQuests: []
        };

        // This part gets the simple data from the user table
        var query = 'SELECT id, AmountOfGold , CurrentLevel from User_Table where id = ?';
        $cordovaSQLite.execute(db, query, [user_id]).then(function (result) {
            if (result.rows.length > 0) {
                userValues.id = result.rows.item(0).id;
                userValues.AmountOfGold = result.rows.item(0).AmountOfGold;
                userValues.CurrentLevel = result.rows.item(0).CurrentLevel;
            };
        });

        // This part gets the potions the user owns
        var query = 'SELECT * from Potion_Table join Userpotion_Table on Potion_Table.id = Userpotion_Table.potion_tableID where Userpotion_Table.user_tableID = ?';
        $cordovaSQLite.execute(db, query, [user_id]).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var potionValues = {
                        id: null,
                        Rank: null,
                        Name: null,
                        Description: null,
                        Price: null,
                        Class: null,
                        ImageFilename: null,
                        Amount: null
                    };
                    potionValues.id = result.rows.item(i).id;
                    potionValues.Rank = result.rows.item(i).Rank;
                    potionValues.Name = result.rows.item(i).Name;
                    potionValues.Description = result.rows.item(i).Description;
                    potionValues.Price = result.rows.item(i).Price;
                    potionValues.Class = result.rows.item(i).Class;
                    potionValues.ImageFilename = result.rows.item(i).ImageFilename;
                    potionValues.Amount = result.rows.item(i).Amount;
                    userValues.OwnedPotions.push(potionValues);
                };

            };
        });

        // This part gets the quests the user has already solved
        var query = 'SELECT * from Quest_Table where id in (select quest_tableID from SolvedQuests_Table where user_tableID = ?)';
        $cordovaSQLite.execute(db, query, [user_id]).then(function (result) {
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var questValues = {
                        id: null,
                        Name: null,
                        Description: null,
                        Rewardmoney: null,
                        Type: null,
                        RewardPotion: [],
                        Discoveries: []
                    };
                    questValues.id = result.rows.item(i).id;
                    questValues.Name = result.rows.item(i).Name;
                    questValues.Description = result.rows.item(i).Description;
                    questValues.Rewardmoney = result.rows.item(i).Rewardmoney;
                    questValues.Type = result.rows.item(i).Type;
                    var potion_tableID = result.rows.item(i).potion_tableID;

                    // Get the RewardPotion for the quest                           
                    var query = 'SELECT * from Potion_Table where id = ?';
                    $cordovaSQLite.execute(db, query, [potion_tableID]).then(function (result) { 
                        if (result.rows.length = 1) {
                            var potionValues = {
                                id: null,
                                Rank: null,
                                Name: null,
                                Description: null,
                                Price: null,
                                Class: null,
                                ImageFilename: null,
                                Amount: null
                            };
                            potionValues.id = result.rows.item(0).id;
                            potionValues.Rank = result.rows.item(0).Rank;
                            potionValues.Name = result.rows.item(0).Name;
                            potionValues.Description = result.rows.item(0).Description;
                            potionValues.Price = result.rows.item(0).Price;
                            potionValues.Class = result.rows.item(0).Class;
                            potionValues.ImageFilename = result.rows.item(0).ImageFilename;
                            potionValues.Amount = 1;
                            questValues.RewardPotion.push(potionValues);
                        };
                    });

                    // Get the Discoveries for the quest                           
                    var query = 'SELECT * from Discovery_Table where id in (select discovery_tableID from RequiredQuestDiscovery_Table where quest_tableID = ?)';
                    $cordovaSQLite.execute(db, query, [questValues.id]).then(function (result) {
                        if (result.rows.length > 0) {
                            for (var i = 0; i < result.rows.length; i++) {
                                var discoveryValues = {
                                    id: null,
                                    Name: null,
                                    FunctionName: null,
                                    Description: null
                                };
                                discoveryValues.id = result.rows.item(i).id;
                                discoveryValues.Name = result.rows.item(i).Name;
                                discoveryValues.Description = result.rows.item(i).Description;
                                discoveryValues.FunctionName = result.rows.item(i).FunctionName;
                                questValues.Discoveries.push(discoveryValues);
                            };
                        };
                    });

                    userValues.SolvedQuests.push(questValues);
                };
            };
        });   
        return userValues;
    };
    
    return this;
});