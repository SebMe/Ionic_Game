myApp.controller('homeViewController', function ($scope, $cordovaSQLite) {

    $scope.$on('$ionicView.enter', function () {
        $scope.potions = potions;
        $scope.discoveredPotions = discoveredPotions;

        // Debug purposes only
        window.localStorage[PotionOfDay.name] = 'false';
        window.localStorage[PotionOfBeginning.name] = 'false';
        window.localStorage[PotionOfTouch.name] = 'false';
        discoveredPotions = [];
    });
 
    
    $scope.insert = function () {
        var query = 'INSERT INTO Potion_Table6 (name) VALUES (?)';
        $cordovaSQLite.execute(db, query, ["Green Potion"]).then(function (result) {
            $scope.result = "success potion";//result.insertId;
        }, function (error) {
            $scope.result = "Error on saving potion: " + error.message;
        });
        /*
        var query = "INSERT INTO Quest_Table (name, potion_tableid) VALUES (?, ?)";
        $cordovaSQLite.execute(db, query, ["Erster Quest", 1]).then(function (result) {
            $scope.result = "success quest";
        }, function (error) {
            $scope.result = "Error on saving quest: " + error.message;
        });*/
    };

    
    $scope.select = function () {
        var query = 'SELECT * from Potion_Table6';
        $cordovaSQLite.execute(db, query).then(function (result) {
            if (result.rows.length > 0) {
                $scope.result = result.rows.item(0);
            } else {
                $scope.result = "select was returned empty";
            }
        }, function (error) {
            console.error(error);
            $scope.result = "error select" + error.message;
        });
    };

    /*
    $scope.select = function () {
        var query = 'SELECT name from Quest_Table';
        $cordovaSQLite.execute(db, query).then(function (result) {
            if (result.rows.length > 0) {
                $scope.quest = result.rows.item(0).name;
            } else {
                $scope.quest = "quest select was returned empty";
            }
        }, function (error) {
            $scope.quest = "error quest select " + error.message;
        });

        var query = 'SELECT * from Potion_Table';
        $cordovaSQLite.execute(db, query).then(function (result) {
            if (result.rows.length > 0) {
                $scope.potion = result.rows.item(0);
            } else {
                $scope.potion = "potion select was returned empty";
            }
        }, function (error) {
            $scope.potion = "error select potion " + error.message;
        });

        var query = 'SELECT * from User_Table';
        $cordovaSQLite.execute(db, query).then(function (result) {
            if (result.rows.length > 0) {
                $scope.user = result.rows.item(0);
            } else {
                $scope.user = "user select was returned empty";
            }
        }, function (error) {
            $scope.user = "error select user " + error.message;
        });
    };*/
});