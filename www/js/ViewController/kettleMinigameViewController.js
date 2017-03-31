myApp.controller('kettleMinigameViewController', function ($scope, $cordovaSQLite, $timeout, $interval, $q, $window, $ionicPopup, databaseFunctions) {
				
	// Called when the view is entered
	$scope.$on('$ionicView.beforeEnter', function () {		
		//screen.lockOrientation('landscape');
		initValues();
		databaseFunctions.getUser($cordovaSQLite).then(function (user) {            	
			$scope.user = user;
        });
	});
		
	// Called before the view is left
	$scope.$on('$ionicView.beforeLeave', function () {
		//screen.lockOrientation('portrait');
		databaseFunctions.updateAllUserData($cordovaSQLite, $scope.user);		
	});
	
	var rankOneValues;
	var rankTwoValues;
	var rankThreeValues;
	var pictureA;
	var pictureB;
	var pictureKettle;
	var score;
	var verticalMovementInterval;
	var divValues;
	
	var initValues = function(){
		
		rankOneValues = {
			rank: 1,
			speed: 0.9,
			speedBase: 0.9,
			heightAccelerationBase: 5,
			heightAcceleration: 5,
			bouncesLeft: 1,
			image: "graphics/potions/rank 1/rank1_yellow.png"
		};
		
		rankTwoValues = {
			rank: 2,
			speed: 0.8,
			speedBase: 0.8,
			heightAccelerationBase: 4,
			heightAcceleration: 4,
			bouncesLeft: 3,
			image: "graphics/potions/rank 2/rank2_red.png"
		};
		
		rankThreeValues = {
			rank: 3,
			speed: 0.2,
			speedBase: 0.2,
			buildUpSpeed: 0,
			buildUpValues: false,
			buildUpFinished: false,
			heightAccelerationBase: 0,
			heightAcceleration: 0,
			bouncesLeft: 1,
			image: "graphics/potions/rank 3/rank3_blue.png"
		};

		pictureA = {
		width: 16,
		height: 16,
		marginLeft: 0,
		marginLeftBase: 0,
		marginTop: 54,
		groundLevel: 54,
		movingDirection: 'plain',
		bounce: false,
		rebounce: false,
		hidePictureIfSetToNone: 'none',
		speed: 0,
		speedBase: 0,
		buildUpSpeed: 0,
		heightAccelerationBase: 0,
		heightAcceleration: 0,
		bouncesLeft: 0,
		image: null,
		rank: 0,
		};
		
		pictureB = {
		width: 16,
		height: 16,
		marginLeft: 84,
		marginLeftBase: 84,
		marginTop: 54,
		groundLevel: 54,
		movingDirection: 'plain',
		bounce: false,
		rebounce: false,
		hidePictureIfSetToNone: 'none',
		speed: 0,
		speedBase: 0,
		buildUpSpeed: 0,
		heightAccelerationBase: 0,
		heightAcceleration: 0,
		bouncesLeft: 0,
		image: null,
		rank: 0,
		};
		
		resetPicture(pictureA, rankOneValues);
		resetPicture(pictureB, rankOneValues);
		
		pictureKettle = {
		marginLeft: 40,
		marginTop: 40,
		width: 20,
		height: 30,
		image: 'KettleMinigame.png',
	    reactionImage: 'KettleReaction.png',
		hidePictureIfSetToNone: 'none'
		};	

		$scope.pictureA = pictureA;
		$scope.pictureB = pictureB;
		$scope.divValues = divValues;
		$scope.pictureKettle = pictureKettle;
		$scope.hideStartTextIfSetToNone = 'block';
		$scope.kettleImageFilename = pictureKettle.image;
		$interval.cancel(verticalMovementInterval);
		$scope.score = 0;
		score = 0;	
	};

	$scope.startGame = function(){
		
		pictureA.hidePictureIfSetToNone = 'block';
		pictureB.hidePictureIfSetToNone = 'block';
		pictureKettle.hidePictureIfSetToNone = 'block';
		$scope.hideStartTextIfSetToNone = 'none';

		verticalMovementInterval = $interval(function(){									
			var pictureAVisible = pictureA.hidePictureIfSetToNone == 'block';
			var pictureBVisible = pictureB.hidePictureIfSetToNone == 'block'
			if(pictureAVisible){pictureA.marginLeft += pictureA.speed;};
			if(pictureBVisible){pictureB.marginLeft -= pictureB.speed;;};			
			
			if(pictureA.buildUpValues == true){
				pictureA.buildUpSpeed += 0.06;
				pictureA.heightAcceleration += 0.3;
				pictureA.heightAccelerationBase += 0.3;
			}else if(pictureA.buildUpFinished == true){
				pictureA.speed = pictureA.buildUpSpeed;
			};
			
			if(pictureB.buildUpValues == true){
				pictureB.buildUpSpeed += 0.06;
				pictureB.heightAcceleration += 0.3;
				pictureB.heightAccelerationBase += 0.3;
			}else if(pictureB.buildUpFinished == true){
				pictureB.speed = pictureB.buildUpSpeed;
			};
			
			checkAndProcessCollision(pictureA, 'left');
			checkAndProcessCollision(pictureB, 'right');
			
			checkAndProcessPictureLandedInKettle(pictureA);
			checkAndProcessPictureLandedInKettle(pictureB);
			
			if(pictureA.bounce == true){
				bouncePicture(pictureA);				
			};
			if(pictureB.bounce == true){
				bouncePicture(pictureB);				
			};
			
			$scope.pictureA = pictureA;
			$scope.pictureB = pictureB;
			$scope.pictureKettle = pictureKettle;
			$scope.score = score;
			
		}, 50);
	};
	
	var checkAndProcessCollision = function(picture, side){
		var pictureBuncedAndFellThroughGround = picture.marginTop > 100;
		var pictureMovedAgainstKettleBorder = (side == 'left') ? pictureMovedAgainstLeftKettleBorder(picture) : pictureMovedAgainstRightKettleBorder(picture);
		if(pictureMovedAgainstKettleBorder || pictureBuncedAndFellThroughGround){
			if(score - 10 >= 0){score -= 10;};
			resetPicture(picture, getRandomRankValues());				
			$timeout(function(){picture.hidePictureIfSetToNone = 'block';},500);
		};
	};
	
	var checkAndProcessPictureLandedInKettle = function(picture){
		if(pictureLandedInKettle(picture)){
			score += 10;			
			resetPicture(picture, getRandomRankValues());				
			$timeout(function(){picture.hidePictureIfSetToNone = 'block';},500);
			$scope.kettleImageFilename = pictureKettle.reactionImage;
			$timeout(function(){$scope.kettleImageFilename = pictureKettle.image;}, 300);
		};
	};
	
	var getRandomRankValues = function(){
		var rankRange = 1;
		if($scope.score > 100)rankRange++;
		if($scope.score > 200)rankRange++;
		var roll = Math.round(Math.random()*100) % rankRange + 1;
		if(roll == 1){
			return rankOneValues;
		} else if(roll == 2){
			return rankTwoValues;
		} else if(roll == 3){
			return rankThreeValues;
		};
	};
	
	$scope.takeReward = function(score){
		$scope.user.AmountOfGold += score;		
		$interval.cancel(verticalMovementInterval);
		showResultPopup();
	};
	
	var pictureLandedInKettle = function(picture){
		var pictureLandedIn = false;
		var makeItEasyReduction = picture.width * 0.25;
		var pictureOnSameHeightAsKettle = picture.marginTop + picture.height - makeItEasyReduction*2 > pictureKettle.marginTop;
		var pictureBetweenStartAndEndOfKettlePicture = picture.marginLeft + makeItEasyReduction >= pictureKettle.marginLeft && picture.marginLeft + picture.width - makeItEasyReduction <= pictureKettle.marginLeft + pictureKettle.width;	
		
		if(pictureOnSameHeightAsKettle && pictureBetweenStartAndEndOfKettlePicture){  
			pictureLandedIn = true;
		};				
		
		return pictureLandedIn;
	};

	var pictureMovedAgainstLeftKettleBorder = function(picture){
		var pictureCollidedWithBorder = false;
		var leftKettleBorderHitbox = pictureKettle.marginLeft;
		var makeItEasyReduction = picture.width * 0.25;
		var rightBorderOfPicture = picture.marginLeft + picture.width - makeItEasyReduction;
		var pictureNotOverKettle = picture.marginTop + picture.height - makeItEasyReduction >= pictureKettle.marginTop;
		var jumpedOverTheBorder = picture.marginLeft + makeItEasyReduction*2 >= pictureKettle.marginLeft;
		
		if(rightBorderOfPicture >= leftKettleBorderHitbox && pictureNotOverKettle && !jumpedOverTheBorder){
			pictureCollidedWithBorder = true;
		};
				
		return pictureCollidedWithBorder;
	};
	
	var pictureMovedAgainstRightKettleBorder = function(picture){
		var pictureCollidedWithBorder = false;
		var makeItEasyReduction = picture.width * 0.25;
		var rightKettleBorderHitbox = pictureKettle.marginLeft + pictureKettle.width;
		var leftBorderOfPicture = picture.marginLeft + makeItEasyReduction;
		var pictureNotOverKettle = picture.marginTop + picture.height - makeItEasyReduction >= pictureKettle.marginTop;
		var jumpedOverTheBorder = picture.marginLeft + picture.width - makeItEasyReduction <= pictureKettle.marginLeft + pictureKettle.width;
		
		if(leftBorderOfPicture <= rightKettleBorderHitbox && pictureNotOverKettle && !jumpedOverTheBorder){
			pictureCollidedWithBorder = true;
		};
				
		return pictureCollidedWithBorder;
	};
	
	var resetPicture = function(picture, rankValues){
		picture.movingDirection = 'none';
		picture.marginTop = picture.groundLevel;
		picture.marginLeft = picture.marginLeftBase;
		picture.heightAcceleration = rankValues.heightAccelerationBase;
		picture.heightAccelerationBase = rankValues.heightAccelerationBase;
		picture.speed = rankValues.speedBase;
		picture.buildUpSpeed = 0;
		picture.buildUpValues = false;
		picture.buildUpFinished = false;
		picture.bounce = false;
		picture.bouncesLeft = rankValues.bouncesLeft;
		picture.hidePictureIfSetToNone = 'none';
		picture.image = rankValues.image;
		picture.rank = rankValues.rank;
	}
	
	var bouncePicture = function(picture){
		var notOnGroundYet = picture.marginTop <= 100;		
		var highestBouncePointNotReachedYet = picture.heightAcceleration >= 0;
		
		if(picture.rebounce){
			picture.movingDirection = 'ascending';
			picture.rebounce = false;
			picture.heightAcceleration = picture.heightAccelerationBase;
		};
		
		if(highestBouncePointNotReachedYet && picture.movingDirection != 'descending'){
			picture.movingDirection = 'ascending';
			picture.marginTop -= picture.heightAcceleration;
			picture.heightAcceleration -= 0.4;
		}else if(notOnGroundYet) {
			picture.movingDirection = 'descending';
			picture.marginTop += picture.heightAcceleration;
			picture.heightAcceleration += 0.4;
		};
	};
	
	var showResultPopup = function(){		
		$scope.resultPopup = $ionicPopup.show({
					template:
							'<style>.popup {min-width:30%;} .popup-body{ background-color: grey} .popup-head{ background-color: gold}</style>'+
							'<h1 align="center" style="font-size:50px;">+ {{score}} <img src="img/Gold.png" style="height: 30px;"</h1>',
					scope: $scope,
					title: 'Reward',
					buttons: [
					{ 	text: 'Awesome!',
						onTap: function (e) {
						  initValues();
						  $scope.resultPopup.close();						  
						}	
					}]
				});
	};
	
	$scope.pictureClicked = function(pictureName){		
		var picture = pictureName == 'pictureA' ? pictureA : pictureB;
		
		if(picture.rank == 3){	
			if(picture.buildUpValues == false && picture.bouncesLeft >= 0){
				picture.speed = 0;
				picture.buildUpValues = true;
				picture.buildUpFinished = false;
				picture.bouncesLeft--;
			} else {
				picture.buildUpValues = false;
				picture.buildUpFinished = true;
				picture.bounce = true;
				picture.bouncesLeft--;
			}
		} else {
			picture.bounce = true;
			if(picture.bouncesLeft > 0){
				picture.rebounce = true;
				picture.bouncesLeft--;
			};
		};	
	};
	
	
	var pictureTouched = function(pictureName){	
		$scope.pictureADown = true;
		var picture = pictureName == 'pictureA' ? pictureA : pictureB;
		if(picture.bouncesLeft >= 0 && picture.rank == 3){
			picture.speed = 0;
			picture.buildUpValues = true;
			picture.buildUpFinished = false;
			picture.bouncesLeft--;
		};
	};
	
	var pictureTouchReleased = function(pictureName){		
		var picture = pictureName == 'pictureA' ? pictureA : pictureB;
		if(picture.buildUpValues == true && picture.rank == 3){
			picture.buildUpValues = false;
			picture.buildUpFinished = true;
			$scope.pictureClicked(pictureName);
		};
	};
});