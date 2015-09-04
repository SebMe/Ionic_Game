// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db = null;

var myApp = angular.module('starter', ['ionic', 'ngCordova'])
.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

      
      // window.openDB is used on the actual phone, window.openDatabase is chrome Syntax, to be able to use the "ionic serve" command to run the app in google chrome browser on pc
      // See https://gist.github.com/borissondagh/29d1ed19d0df6051c56f 
      if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("myapp4.db");
    } else {
          // Google Chrome Syntax
          // Database is stored by Chrome under C:\Users\Seb\AppData\Local\Google\Chrome\User Data\Default\databases\http_192.168.2.100_8100\1 - open with SqliteBrowser(Open DB, Show all files, pick the 1)
      db = window.openDatabase("myapp4.db", "1.0", "MyAppInfo", -1);
    }


    // Always delete the old database (per hand from the folder) or create a new one.
    // A new DB is created by changing from existing myapp6 openDB(myapp6.db) to openDB(myapp7.db).
    // If you make changes to the tables the changes are otherwise ignored, since the table already exists.

    createTables($cordovaSQLite);
      /* 
    // Init the tables with values
    fillPotionTable($cordovaSQLite);
    fillUserTable($cordovaSQLite);
    fillUserpotionTable($cordovaSQLite);
    fillDiscoveryTable($cordovaSQLite);
    fillQuestTable($cordovaSQLite);
    fillSolvedQuestsTable($cordovaSQLite);
    fillRequiredQuestDiscoveryTable($cordovaSQLite);
    fillRequiredQuestPotionTable($cordovaSQLite);
    */

      
  });
})

// Solves an tab issue, that would otherwise be shown at the top of the screen
myApp.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
})

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
    })

    $stateProvider.state('state_PotionViewDisplayed', {
        url: '/potions',
        views: {
            name_potionView: {
                templateUrl: 'templates/potionView.html'
            }
        }
    })

    $stateProvider.state('state_PotionDiscoveryViewDisplayed', {
        url: '/discovery',
        views: {
            name_potionDiscoveryView: {
                templateUrl: 'templates/potionDiscoveryView.html'
            }
        }
    })
})


// List of all implemented potions
var potions = [PotionOfBeginning, PotionOfDay, PotionOfTouch];

// This field is filled in potionDiscoveryController each time a new potion is discovered and used in the other controllers to display the values in views
// For init the info of already discovered potions is retrieved from harddrive
var discoveredPotions = [];
for (var i = 0; i < potions.length; i++) {
    var potionDiscovered = window.localStorage[potions[i].name];
    if (potionDiscovered == 'true') {
        discoveredPotions.push(potions[i]);
    }
}




    

