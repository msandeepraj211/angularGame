/**
 *  Module Game
 *
 * Description
 *
 *  This module is the code functionilaty of the game specified in the assignment.
 */
(function() {
    'use strict';
    angular.module('game', []).controller('game', ['$scope',function($scope) {
    	$scope.options={
                    rows: 4,
                    columns: 4,
                    time: 10,
                    level: 5,
                    lives: 3
                };


    }]).directive('game', ['$window', '$timeout', function($window, $timeout) {
        return {
            scope: {
                options: '=?'
            },
            templateUrl: 'partials/game.html',
            link: (scope, ele, attr) => {
                const options = {
                    rows: 4,
                    columns: 4,
                    time: 4,
                    level: 5,
                    lives: 3,
                    height: $window.innerHeight * 0.96,
                    width: $window.innerWidth * 0.96
                };
                let gameEnd;
                scope.newGame = () => {
                    scope.targets = [];
                    scope.options = angular.extend(options, scope.options);
                    scope.options.livesRemaining = scope.options.lives;
                    scope.cellStyle = 'height:' + Math.floor(scope.options.height / scope.options.rows) + 'px;' + 'width:' + Math.floor(scope.options.width / scope.options.columns) + 'px;';
                    scope.newLife();
                };
                scope.newLife = () => {
                    if (scope.options.livesRemaining) {
                        for (let i = scope.targets.length; i < scope.options.level; i += 1) {
                            let target = Math.floor(Math.random() * scope.options.columns * scope.options.rows);
                            if (scope.targets.indexOf(target) === -1) {
                                scope.targets.push(target);
                            } else {
                                i -= 1;
                            }
                        }
                        scope.options.livesRemaining -= 1;
                        scope.playing = true;
                        gameEnd=$timeout(() => { scope.playing = false; }, scope.options.time*1000);
                    }
                };
                scope.targetClicked = (index) => {
                    let i = scope.targets.indexOf(index);
                    if (i !== -1) {
                        scope.targets.splice(i, 1);
                        if( !scope.targets.length){
                        	scope.playing = false;
                        	$timeout.cancel(gameEnd);
                        }
                        // angular.element(event.currentTarget).css('background-image',"url('/pics/blast.gif'),url('/pics/normal.png')");
                    }
                };
                scope.newGame();
                scope.$watch('options',function(newVal,oldVal){
                	if(newVal){
                		scope.cellStyle = 'height:' + Math.floor(scope.options.height / scope.options.rows) + 'px;' + 'width:' + Math.floor(scope.options.width / scope.options.columns) + 'px;';
                	}
                },true);
            }
        };
    }]).directive('mobileClick', [function() {
        return function(scope, elem, attrs) {
            elem.on('touchstart click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scope.$apply(attrs['mobileClick']);
            });
        };
    }]).directive('settings',[function(){
    	return {
    		restrict:'E',
    		transclude:{
    			'title':'?settingsTitle',
    			'body':'?settingsBody'
    		},
    		templateUrl:'partials/settings.html'
    	};
    }]);
})();
