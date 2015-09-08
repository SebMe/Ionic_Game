/*
var userValues = {
            ID: null,
            AmountOfGold: null,
            CurrentLevel: null,
            OwnedPotions: [ownedPotion, ownedPotion, ...],
            SolvedQuests: [solvedQuest, solvedQuest, ...]
        };
        
                                                        var ownedPotion = {
                                                                        ID: null,
                                                                        Rank: null,
                                                                        Name: null,
                                                                        Description: null,
                                                                        Price: null,
                                                                        Class: null,
                                                                        ImageFilename: null,
                                                                        Amount: null
                                                                    };

                                                        var solvedQuest = {
                                                                        ID: null,
                                                                        Name: null,
                                                                        Description: null,
                                                                        Rewardmoney: null,
                                                                        Type: null,
                                                                        RewardPotions: [rewardPotion, rewardPotion, ...],
                                                                        RequiredPotions:[requiredPotion, requiredPotion, ...],
                                                                        Discoveries: [requiredDiscovery, requiredDiscovery, ...]
                                                                    };
                                                                                               
                                                                                                                                var rewardPotion = {
                                                                                                                                                ID: null,
                                                                                                                                                Rank: null,
                                                                                                                                                Name: null,
                                                                                                                                                Description: null,
                                                                                                                                                Price: null,
                                                                                                                                                Class: null,
                                                                                                                                                ImageFilename: null,
                                                                                                                                                RewardAmount: null,
                                                                                                                                            };

                                                                                                                                var requiredPotion = {
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

                                                                                                                                var requiredDiscovery = {
                                                                                                                                                    ID: null,
                                                                                                                                                    Name: null,
                                                                                                                                                    FunctionName: null,
                                                                                                                                                    Description: null,
                                                                                                                                                    questid: null
                                                                                                                                                };
                                                                                                         

How to create a View:

- Create templates/myView.html:
    <ion-view ng-controller="myViewController">
    User has: {{userGoldForView}} Gold
    </ion-view>


- Create js/ViewController/myViewController.js:
myApp.controller('myViewController', function ($scope, $cordovaSQLite, databaseFunctions) {
$scope.userGold = function () {
        databaseFunctions.getUser($cordovaSQLite).then(function (userStructure) {
            $scope.userGoldForView = userStructure.AmountOfGold;
            databaseFunctions.updateAllUserData($cordovaSQLite, values); // This line only when u made changes to the user structure that should be stored in the db
        });
    };
}


- Add in index.html under the last script in list: <script src="js/ViewController/myViewController.js"></script>


- Add in index.html under the last tab:
<ion-tab icon="ion-android-clipboard" ui-sref="state_MyViewDisplayed">
            <ion-nav-view name="name_myView"></ion-nav-view>
        </ion-tab>


- Add in js/app.js:
$stateProvider.state('state_MyViewDisplayed', {
        url: '/myView',
        views: {
            name_myView: {
                templateUrl: 'templates/myView.html'
            }
        }
    });


*/