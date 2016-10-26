//Module
var app = angular.module('app', ['ngRoute']);

//ROUTES
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/timer.html',
            controller: 'timerController'
        })
        .when('/timer', {
            templateUrl: 'pages/timer.html',
            controller: 'timerController'
        })
        .when('/todo', {
            templateUrl: 'pages/todo.html',
            controller: 'todoController'
        })
});

app.run(function ($rootScope) {
    $rootScope.timerSeconds = 120;
    $rootScope.countingDown = false;

});

//SERVICES
app.service('todoListService', function () {
    this.list = [{
        name: "Test",
        complete: false
    }];
})


//CONTROLLERS
app.controller('todoController', ['$scope', '$location', 'todoListService', function ($scope, $location, todoListService) {
    $scope.sortByComplete = false;
    $scope.list = todoListService.list;

    $scope.addItem = function () {
        if ($scope.list.name !== undefined) {
            $scope.list.push({
                name: $scope.list.name,
                complete: false
            });

            todoListService.list = $scope.list;
            $scope.list.name = undefined;
        } else {
            console.log("Please enter a string")
        }
        //ELSE THROUGH MESSAGE
    };

    $scope.removeItem = function (index) {
        $scope.list[index].complete = true;
        //$scope.list.splice(index, 1);
    };
}]);

app.controller('timerController', ['$scope', '$interval', '$rootScope', 'todoListService', function ($scope, $interval, $rootScope, todoListService) {

    //Initializing
    $scope.timerTime = returnFormattedToSeconds($rootScope.timerSeconds); //5:30
    $scope.timerInput = 2;


    //When user changes the input/#of minutes:
    $scope.initialize = function () {
        if ($scope.timerInput >= 0) {
            $rootScope.timerSeconds = $scope.timerInput * 60;
            $scope.timerTime = returnFormattedToSeconds($rootScope.timerSeconds);
        }
    }

    //When returning back from todo list, and and there is still time left
    if ($rootScope.countingDown) {
        $('#pause').removeClass("active");
        $('#play').addClass("active");
        startTimer();
    }

    //Just for Testing Purposes
    //console.log($rootScope.countingDown);


    //User clicks play
    $scope.start = function () {
        //Make sure not to duplicate
        if ($rootScope.timerSeconds > 0 && !$rootScope.countingDown) {
            $('#pause').removeClass("active");
            $('#play').addClass("active");
            $rootScope.countingDown = true;
            startTimer();
        }
    };


    function startTimer() {
        if (typeof timerInterval !== 'undefined')
            $interval.cancel(timerInterval);

        timerInterval = $interval(function () {
            $scope.timerTime = returnFormattedToSeconds(--$rootScope.timerSeconds);
            console.log("in controller " + $scope.timerTime);

            if ($rootScope.timerSeconds <= 0) {
                $scope.timerTime = returnFormattedToSeconds(0);
                $scope.pause();
            }
        }, 1000)
    }

    $scope.pause = function () {
        $interval.cancel(timerInterval);
        $rootScope.countingDown = false;
        $('#play').removeClass("active");
        $('#pause').addClass("active");
    }

    $scope.reset = function () {
        $scope.pause();
        $rootScope.timerSeconds = $scope.timerInput * 60;
        $scope.timerTime = returnFormattedToSeconds($rootScope.timerSeconds);
    }

    function returnFormattedToSeconds(time) {
        var minutes = Math.floor(time / 60),
            seconds = Math.round(time - minutes * 60);

        seconds = seconds < 10 ? '0' + seconds : seconds;
        return minutes + ":" + seconds;
    }
}]);
