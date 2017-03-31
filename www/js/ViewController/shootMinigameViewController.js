myApp.controller('shootMinigameViewController', function ($scope, $cordovaSQLite, $timeout, $q, $window, databaseFunctions) {
	
	// Called when the view is entered
	$scope.$on('$ionicView.enter', function () {		
		databaseFunctions.getUser($cordovaSQLite).then(function (user) {            	
			// Check root/Code/www/dataStructures.txt for the user structure
			$scope.user = user;
        });
	});
	
	// Called before the view is left
	$scope.$on('$ionicView.beforeLeave', function () {
		databaseFunctions.updateAllUserData($cordovaSQLite, $scope.user);
	});	
	
	$scope.returnPixelForGivenPercentage = function(percentage, alignment){
		var pixels = -1;
		if(alignment == 'height'){
			pixels = Math.round($window.screen.height * percentage / 100);
		} else if(alignment == 'width'){
			pixels = Math.round($window.screen.width * percentage / 100);
		};
		return pixels;
	};
	
	$scope.getWidth = function(){
		$scope.theWidth = $window.screen.width;
	};
});