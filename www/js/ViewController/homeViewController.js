myApp.controller('homeViewController', function ($scope, $cordovaSQLite, $timeout, $q, $cordovaNativeAudio, databaseFunctions) {

	
	$scope.$on('$ionicView.afterEnter', function () {		
		//$cordovaNativeAudio.preloadSimple('doorSound', 'sounds/door.mp3');
		//screen.lockOrientation('portrait');	
	});
	
	$scope.playDoorSound = function(){
		//$cordovaNativeAudio.play('doorSound');
	};
});