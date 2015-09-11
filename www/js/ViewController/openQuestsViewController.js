myApp.controller('openQuestsViewController', function ($scope, $cordovaSQLite, $cordovaNativeAudio, databaseFunctions) {
    databaseFunctions.getUser($cordovaSQLite).then(function (user) {
        $scope.info = user;
    });
});