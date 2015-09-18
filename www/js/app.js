// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db = null;

var myApp = angular.module('starter', ['ionic', 'ngCordova'])
.run(function ($ionicPlatform, $cordovaSQLite, $q) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        // window.openDB is used on the actual phone, window.openDatabase is chrome Syntax, to be able to use the "ionic serve" command to run the app in google chrome browser on pc
        // See https://gist.github.com/borissondagh/29d1ed19d0df6051c56f 
        if (window.cordova) {
            // App syntax
            db = $cordovaSQLite.openDB("myapp.db");
        } else {
            // Google Chrome Syntax
            // Database is stored by Chrome under C:\Users\Seb\AppData\Local\Google\Chrome\User Data\Default\databases\http_192.168.2.100_8100\1 - open with SqliteBrowser(Open DB, Show all files, pick the 1)
            db = window.openDatabase("myapp.db", "1.0", "MyAppInfo", -1);
        }

        
        // Delete existing tables, if changes were made to a table
        $cordovaSQLite.execute(db, 'DROP TABLE Potion_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE User_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE Userpotion_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE Discovery_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE Quest_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE SolvedQuests_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE RequiredQuestDiscovery_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE RequiredQuestPotion_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE RewardQuestPotion_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE FoundDiscoveries_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE UserDiscoveryData_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE UserItem_Table');
        
        // Create all tables
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Potion_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, Rank INTEGER, Name TEXT, Description TEXT, Price INTEGER, Class TEXT, ImageFilename TEXT, UNIQUE(Rank, Class))');
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS User_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, AmountOfGold INTEGER, CurrentLevel INTEGER, Name TEXT, ChanceExtraPotionOnUpgrade INTEGER, ExtraPotionOnQuest INTEGER, ExtraGoldOnDiscovery INTEGER, DiscoveryCDReductionPercentage INTEGER, TraderDiscountPercentage INTEGER, UNIQUE(Name))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Userpotion_Table(User_TableID INTEGER, Potion_TableID INTEGER, Amount INTEGER, UNIQUE(User_TableID, Potion_TableID))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Discovery_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, Description TEXT, Name TEXT, UNIQUE(Name))");
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Quest_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Description TEXT, Rewardmoney INTEGER, Type TEXT, UNIQUE(Name))');
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS SolvedQuests_Table(User_TableID INTEGER, Quest_TableID INTEGER, UNIQUE(User_TableID, Quest_TableID))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RequiredQuestDiscovery_Table(Quest_TableID INTEGER, Discovery_TableID INTEGER, UNIQUE(Quest_TableID, Discovery_TableID))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RequiredQuestPotion_Table(Quest_TableID INTEGER, Potion_TableID INTEGER, AmountNeeded INTEGER, UNIQUE(Quest_TableID, Potion_TableID))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RewardQuestPotion_Table(Quest_TableID INTEGER, Potion_TableID INTEGER, RewardAmount INTEGER, UNIQUE(Quest_TableID, Potion_TableID))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS FoundDiscoveries_Table(User_TableID INTEGER, Discovery_TableID INTEGER, AvailabilityDate INTEGER, UNIQUE(User_TableID, Discovery_TableID))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS UserDiscoveryData_Table(User_TableID INTEGER, Discovery_TableID INTEGER, DiscoveryData TEXT, UNIQUE(User_TableID, Discovery_TableID))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS UserItem_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, User_TableID INTEGER, Class TEXT, Price INTEGER, ChanceExtraPotionOnUpgrade INTEGER, ExtraPotionOnQuest INTEGER, ExtraGoldOnDiscovery INTEGER, DiscoveryCDReductionPercentage INTEGER, TraderDiscountPercentage INTEGER, ImageFilename TEXT, Equipped TEXT)");

        // Init the tables with values
        // Performs the insertQuery and sets the returned ID in the provided dataArray[currentElementIndex]
        var executeQueryHelper = function (insertQuery, parameters, currentElementIndex, dataArray) {
            var lastElementInserted = false;
            var q = $q.defer();
            parameters = parameters || []; // Use empty field in case no parameters are used
            $cordovaSQLite.execute(db, insertQuery, parameters).then(function (result) {
                dataArray[currentElementIndex].ID = result.insertId;
                var lastElementIndex = dataArray.length - 1;
                if (currentElementIndex == lastElementIndex) {
                    lastElementInserted = true;
                };
                q.resolve(lastElementInserted);
            });
            return q.promise;
        };
        
        // Fill Potion_Table function, insertPotions().then(function(){}) is triggered when all elements were inserted into the db
        var insertPotions = function () {
            var q = $q.defer();
            var query = 'INSERT INTO Potion_Table (Rank, Name, Description, Price, Class, ImageFilename) VALUES (?, ?, ?, ?, ?, ?)';
            for (var i = 0; i < potions.length; i++) {
                var currentElementIndex = i;
                executeQueryHelper(query, [potions[i].Rank, potions[i].Name, potions[i].Description, potions[i].Price, potions[i].Class, potions[i].ImageFilename], currentElementIndex, potions).then(function (lastElementInserted) {
                    if (lastElementInserted) {
                         q.resolve(potions);
                    };
                });
            };
            return q.promise;
        };
        
        // Fill Discovery_Table function
        var insertDiscoveries = function () {
            var q = $q.defer();
            var query = "INSERT INTO Discovery_Table (Description, Name) VALUES (?, ?)";
            for (var i = 0; i < discoveries.length; i++) {
                var currentElementIndex = i;
                executeQueryHelper(query, [discoveries[i].Description, discoveries[i].Name], currentElementIndex, discoveries).then(function (lastElementInserted) {
                    if (lastElementInserted) {
                        q.resolve(discoveries);
                    };
                });
            };
            return q.promise;
        };
        
        // Fill Quest_Table function
        var insertQuests = function () {
            var q = $q.defer();
            var query = "INSERT INTO Quest_Table (Name, Description, Rewardmoney, Type) VALUES (?, ?, ?, ?)";
            for (var i = 0; i < quests.length; i++) {
                var currentElementIndex = i;
                executeQueryHelper(query, [quests[i].Name, quests[i].Description, quests[i].Rewardmoney, quests[i].Type], currentElementIndex, quests).then(function (lastElementInserted) {
                    if (lastElementInserted) {
                        q.resolve(quests);
                    };
                });
            };
            return q.promise;
        };

        // Fill User_Table function
        var insertUsers = function () {
            var q = $q.defer();
            var query = "INSERT INTO User_Table (AmountOfGold, CurrentLevel, Name) VALUES (?, ?, ?)";
            for (var i = 0; i < users.length; i++) {                
                var currentElementIndex = i;
                executeQueryHelper(query, [users[i].AmountOfGold, users[i].CurrentLevel, users[i].Name], currentElementIndex, users).then(function (lastElementInserted) {
                    if (lastElementInserted) {
                        q.resolve(users);
                    };
                });
            };
            return q.promise;
        };

        var getPotionID = function(potionClass, potionRank, potionList){
            for (var i = 0; i < potionList.length; i++) {
                if (potionList[i].Class == potionClass && potionList[i].Rank == potionRank) {
                    return potionList[i].ID;
                };
            };
        };

        var getDiscoveryID = function (discoveryName, discoveryList) {
            for (var i = 0; i < discoveryList.length; i++) {
                if (discoveryList[i].Name == discoveryName) {
                    return discoveryList[i].ID;
                };
            };
        };

        var getQuestID = function (questName, questList) {
            for (var i = 0; i < questList.length; i++) {
                if (questList[i].Name == questName) {
                    return questList[i].ID;
                };
            };
        };
        
        // $q.all will wait until the potions, discoveries and quests are inserted; necessary because only then will we know the correct ID's to use (see below)
        var insertedPotions = insertPotions();
        var insertedDiscoveries = insertDiscoveries();
        var insertedQuests = insertQuests();
        $q.all([insertedPotions, insertedDiscoveries, insertedQuests]).then(function (dataset) {
            var allPotions = dataset[0];
            var allDiscoveries = dataset[1];
            var allQuests = dataset[2];

            // Fill quest related tables
            for (var i = 0; i < allQuests.length; i++) {
                var currentQuestID = allQuests[i].ID;
                
                // Fill RewardQuestPotionTable
                var query = "INSERT INTO RewardQuestPotion_Table (Quest_TableID, Potion_TableID, RewardAmount) VALUES (?, ?, ?)";
                var rewardPotions = allQuests[i].RewardPotions;
                for (var x = 0; x < rewardPotions.length; x++) {
                    var rewardPotionID = getPotionID(rewardPotions[x].Class, rewardPotions[x].Rank, allPotions);
                    $cordovaSQLite.execute(db, query, [currentQuestID, rewardPotionID, rewardPotions[x].RewardAmount]);
                };
                
                // Fill RequiredQuestPotionTable
                var query = "INSERT INTO RequiredQuestPotion_Table (Quest_TableID, Potion_TableID, AmountNeeded) VALUES (?, ?, ?)";
                var requiredPotions = allQuests[i].RequiredPotions;
                for (var x = 0; x < requiredPotions.length; x++) {
                    var requiredPotionID = getPotionID(requiredPotions[x].Class, requiredPotions[x].Rank, allPotions);
                    $cordovaSQLite.execute(db, query, [currentQuestID, requiredPotionID, requiredPotions[x].AmountNeeded]);
                };

                // Fill RequiredQuestDiscoveryTable
                var query = "INSERT INTO RequiredQuestDiscovery_Table (Quest_TableID, Discovery_TableID) VALUES (?, ?)";
                var requriedQuestDiscoveries = allQuests[i].Discoveries;
                for (var x = 0; x < requriedQuestDiscoveries.length; x++) {
                    var requiredDiscoveryID = getDiscoveryID(requriedQuestDiscoveries[x].Name, allDiscoveries);
                    $cordovaSQLite.execute(db, query, [currentQuestID, requiredDiscoveryID]);
                };
            };           
        });
        
        var insertedUsers = insertUsers();
        $q.all([insertedPotions, insertedUsers, insertedQuests, insertedDiscoveries]).then(function (dataset) {
            var allPotions = dataset[0];
            var allUsers = dataset[1];
            var allQuests = dataset[2];
            var allDiscoveries = dataset[3];

            // Fill user related tables
            for (var i = 0; i < allUsers.length; i++) {
                var currentUserID = allUsers[i].ID;

                // Fill SolvedQuestsTable
                var query = "INSERT INTO SolvedQuests_Table (User_TableID, Quest_TableID) VALUES (?, ?)";
                var solvedQuests = allUsers[i].SolvedQuests;
                for (var x = 0; x < solvedQuests.length; x++) {
                    var solvedQuestID = getQuestID(solvedQuests[x].Name, allQuests);
                    $cordovaSQLite.execute(db, query, [currentUserID, solvedQuestID]);
                };

                // Fill UserpotionTable
                var query = "INSERT INTO Userpotion_Table (User_TableID, Potion_TableID, Amount) VALUES (?, ?, ?)";
                var userpotions = allUsers[i].OwnedPotions;
                for (var x = 0; x < userpotions.length; x++) {
                    var userpotionID = getPotionID(userpotions[x].Class, userpotions[x].Rank, allPotions);
                    $cordovaSQLite.execute(db, query, [currentUserID, userpotionID, userpotions[x].Amount]);
                };

                // Fill FoundDiscoveries_Table
                var query = "INSERT INTO FoundDiscoveries_Table (User_TableID, Discovery_TableID, AvailabilityDate) VALUES (?, ?, ?)";
                var userDiscoveries = allUsers[i].FoundDiscoveries;
                for (var x = 0; x < userDiscoveries.length; x++) {
                    var discoveryID = getDiscoveryID(userDiscoveries[x].Name, allDiscoveries);
                    $cordovaSQLite.execute(db, query, [currentUserID, discoveryID, userDiscoveries[x].AvailabilityDate]);
                };
            };
        });
    });
});

// Solves an tab issue, that would otherwise be shown at the top of the screen
myApp.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
});

// State Machine for the App, common way to have more than one view (homeView, potionView, potionDiscoveryView)
// See http://learn.ionicframework.com/formulas/navigation-and-routing-part-1/
myApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/')

    $stateProvider.state('state_HomeViewDisplayed', {
        url: '/home',
        views: {
            name_home: {
                templateUrl: 'templates/homeView.html'
            }
        }
    });

    $stateProvider.state('state_PotionViewDisplayed', {
        url: '/potions',
        views: {
            name_potionView: {
                templateUrl: 'templates/potionView.html'
            }
        }
    });

    $stateProvider.state('state_PotionDiscoveryViewDisplayed', {
        url: '/discovery',
        views: {
            name_potionDiscoveryView: {
                templateUrl: 'templates/potionDiscoveryView.html'
            }
        }
    });

    $stateProvider.state('state_QuestViewDisplayed', {
        url: '/quest',
        views: {
            name_questView: {
                templateUrl: 'templates/questView.html'
            }
        }
    });

    $stateProvider.state('state_TraderViewDisplayed', {
        url: '/trader',
        views: {
            name_traderView: {
                templateUrl: 'templates/traderView.html'
            }
        }
    });

    $stateProvider.state('state_ProfessorViewDisplayed', {
        url: '/professor',
        views: {
            name_professorView: {
                templateUrl: 'templates/professorView.html'
            }
        }
    });

    $stateProvider.state('state_UserViewDisplayed', {
        url: '/user',
        views: {
            name_userView: {
                templateUrl: 'templates/userView.html'
            }
        }
    });
  
    $stateProvider.state('state_UpgradePotionViewDisplayed', {
        url: '/upgradePotion',
        views: {
            name_upgradePotionView: {
                templateUrl: 'templates/upgradePotionView.html'
            }
        }
    });

    $stateProvider.state('state_UserCharacterViewDisplayed', {
        url: '/character',
        views: {
            name_userCharacterView: {
                templateUrl: 'templates/userCharacterView.html'
            }
        }
    });
	
	$stateProvider.state('state_PotionCollectMinigameViewDisplayed', {
        url: '/minigame/potionCollect',
        views: {
            name_potionCollectMinigameView: {
                templateUrl: 'templates/potionCollectMinigameView.html'
            }
        }
    });
});




    

