// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db = null;

var myApp = angular.module('starter', ['ionic', 'ngCordova'])
.run(function ($ionicPlatform, $cordovaSQLite) {
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


        // Delete existing tables, so the init (see below) doesnt create multiple values if run a second time)
        $cordovaSQLite.execute(db, 'DROP TABLE Potion_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE User_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE Userpotion_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE Discovery_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE Quest_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE SolvedQuests_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE RequiredQuestDiscovery_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE RequiredQuestPotion_Table');
        $cordovaSQLite.execute(db, 'DROP TABLE RewardQuestPotion_Table');

        // Create all tables
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Potion_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, Rank INTEGER, Name TEXT, Description TEXT, Price INTEGER, Class TEXT, ImageFilename TEXT)');
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS User_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, AmountOfGold INTEGER, CurrentLevel INTEGER)");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Userpotion_Table(User_TableID INTEGER, Potion_TableID INTEGER, Amount INTEGER, UNIQUE(User_TableID, Potion_TableID))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Discovery_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, FunctionName TEXT, Description TEXT, Name TEXT)");
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Quest_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Description TEXT, Rewardmoney INTEGER, Type TEXT)');
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS SolvedQuests_Table(User_TableID INTEGER, Quest_TableID INTEGER)");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RequiredQuestDiscovery_Table(Quest_TableID INTEGER, Discovery_TableID INTEGER)");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RequiredQuestPotion_Table(Quest_TableID INTEGER, Potion_TableID INTEGER, AmountNeeded INTEGER)");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RewardQuestPotion_Table(Quest_TableID INTEGER, Potion_TableID INTEGER, RewardAmount INTEGER)");

        // Init the tables with values
        // fill PotionTable
        var query = 'INSERT INTO Potion_Table (Rank, Name, Description, Price, Class, ImageFilename) VALUES (?, ?, ?, ?, ?, ?)';
        $cordovaSQLite.execute(db, query, [1, "Yellow Potion", "It's yellow", 100, "YellowPotion", "YellowPotion.png"]);
        $cordovaSQLite.execute(db, query, [1, "Green Potion", "It's green", 100, "GreenPotion", "GreenPotion.png"]);

        $cordovaSQLite.execute(db, query, [2, "Greater Yellow Potion", "It's yellow", 500, "YellowPotion", "GreaterYellowPotion.png"]);
        $cordovaSQLite.execute(db, query, [2, "Greater Green Potion", "It's green", 500, "GreenPotion", "GreaterGreenPotion.png"]);

        $cordovaSQLite.execute(db, query, [3, "Perfect Yellow Potion", "It's yellow", 1000, "YellowPotion", "PerfectYellowPotion.png"]);
        $cordovaSQLite.execute(db, query, [3, "Perfect Green Potion", "It's green", 1000, "GreenPotion", "PerfectGreenPotion.png"]);

        // fill UserTable
        var query = "INSERT INTO User_Table (AmountOfGold, CurrentLevel) VALUES (?, ?)";
        $cordovaSQLite.execute(db, query, [3000, 1]);

        // fill UserpotionTable
        var query = "INSERT INTO Userpotion_Table (User_TableID, Potion_TableID, Amount) VALUES (?, ?, ?)";
        $cordovaSQLite.execute(db, query, [1, 1, 5]);
        $cordovaSQLite.execute(db, query, [1, 3, 3]);
        $cordovaSQLite.execute(db, query, [1, 4, 3]);
        $cordovaSQLite.execute(db, query, [1, 5, 2]);
        $cordovaSQLite.execute(db, query, [1, 6, 2]);

        // fill DiscoveryTable
        var query = "INSERT INTO Discovery_Table (FunctionName, Description, Name) VALUES (?, ?, ?)";
        $cordovaSQLite.execute(db, query, ["DiscoveryOfDay()", "It must be daytime", "Discovery of Day"]);

        // fill QuestTable
        var query = "INSERT INTO Quest_Table (Name, Description, RewardMoney, Type) VALUES (?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, ["First small Quest", "Your first small quest", 300, "small"]);
        $cordovaSQLite.execute(db, query, ["First Big Quest", "Your first big quest", 1000, "big"]);
        $cordovaSQLite.execute(db, query, ["Mighty Quest", "A mighty quest", 1500, "big"]);

        // fill SolvedQuestsTable
        var query = "INSERT INTO SolvedQuests_Table (User_TableID, Quest_TableID) VALUES (?, ?)";
        $cordovaSQLite.execute(db, query, [1, 3]);

        // fill RequiredQuestDiscoveryTable
        var query = "INSERT INTO RequiredQuestDiscovery_Table (Quest_TableID, Discovery_TableID) VALUES (?, ?)";
        $cordovaSQLite.execute(db, query, [2, 1]);
        $cordovaSQLite.execute(db, query, [3, 1]);

        // fill RequiredQuestPotionTable
        var query = "INSERT INTO RequiredQuestPotion_Table (Quest_TableID, Potion_TableID, AmountNeeded) VALUES (?, ?, ?)";
        $cordovaSQLite.execute(db, query, [2, 4, 2]);
        $cordovaSQLite.execute(db, query, [3, 4, 2]);
        $cordovaSQLite.execute(db, query, [3, 3, 2]);

        // fill RewardQuestPotionTable
        var query = "INSERT INTO RewardQuestPotion_Table (Quest_TableID, Potion_TableID, RewardAmount) VALUES (?, ?, ?)";
        $cordovaSQLite.execute(db, query, [2, 4, 4]);
        $cordovaSQLite.execute(db, query, [3, 4, 2]);
        $cordovaSQLite.execute(db, query, [3, 6, 1]);
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
});




    

