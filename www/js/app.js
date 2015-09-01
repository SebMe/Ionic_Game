// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
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


// Needed variables used in the controllers
var potions = [PotionOfBeginning, PotionOfDay];
// Variable ist nur gefüllt wenn der controller sie füllt, danach für jeden aufruf leer!! - verständnis für "globale" variablen fehlt
var discoveredPotions = [];

myApp.controller('potionViewController', function($scope){
    $scope.$on('$ionicView.enter', function () {
        $scope.discoveredPotions = discoveredPotions;
    });
})

myApp.controller('homeViewController', function ($scope) {
    $scope.$on('$ionicView.enter', function () {
        $scope.potions = potions;
        $scope.discoveredPotions = discoveredPotions;

        // Debug purposes only
        window.localStorage[PotionOfDay.name] = 'false';
        window.localStorage[PotionOfBeginning.name] = 'false';
        discoveredPotions = [];
    });
})

myApp.controller('potionDiscoveryViewController', function ($scope, $interval) {
    $scope.$on('$ionicView.enter', function () {
    var newlyDiscoveredPotions = [];

    // Potion of Beginning    
    var potionOfBeginningDiscovered = window.localStorage[PotionOfBeginning.name];
    if (potionOfBeginningDiscovered != 'true') {
        discoveredPotions.push(PotionOfBeginning);
        newlyDiscoveredPotions.push(PotionOfBeginning);
        window.localStorage[PotionOfBeginning.name] = 'true';
    }

    // Potion Of Day 
    var potionOfDayDiscovered = window.localStorage[PotionOfDay.name];
    var currentHour = (new Date).getHours();
    var itIsDaytime = currentHour >= 8 && currentHour <= 20;
    if (itIsDaytime && potionOfDayDiscovered != 'true') {
        newlyDiscoveredPotions.push(PotionOfDay);
        discoveredPotions.push(PotionOfDay);
        window.localStorage[PotionOfDay.name] = 'true';
    }

    // Show the newly discovered potions
    var index = 0;
    var showNewlyDiscoveredPotions = $interval(function (index) {
        if (index < newlyDiscoveredPotions.length) {
            $scope.potion = newlyDiscoveredPotions[index];
        } else {
            $scope.potion = null; // After the last discovered potion is shown the screen will be empty again (no potion displayed)
            $interval.cancel(showNewlyDiscoveredPotions);
        }
    }, 1500);
    });
})
    

