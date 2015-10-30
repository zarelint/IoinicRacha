'use strict';
var requestToken = "";
var accessToken = "";
var clientId = '321359984550-9otvkbcpbk6kj52e4i5oih5mkrdamnlp.apps.googleusercontent.com';
var clientSecret = "BilFKZS3JiNAkgqk8PobtnUX";


var app=angular.module('app', ['ionic','angular.filter'])
    .run(function($ionicPlatform, $window, $location, AuthenticationFactory) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });


/*        // when the page refreshes, check if the user is already logged in
        AuthenticationFactory.check();
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
                $location.path("/login");
            } else {
// check if user object exists else fetch it. This is incase of a page refresh
                if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
                if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            }
        });
        $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
            $rootScope.showMenu = AuthenticationFactory.isLogged;
            $rootScope.role = AuthenticationFactory.userRole;
// if the user is already logged in, take him to the home page
            if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
                $location.path('/');
            }
        });*/
    })

    .config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .config(function($ionicConfigProvider) {
        if (!ionic.Platform.isIOS()) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }
    })
    .config(function($httpProvider,$stateProvider, $urlRouterProvider) {

        $httpProvider.interceptors.push('TokenInterceptor');

         //$locationProvider.html5Mode(true).hashPrefix('!');
         //$locationProvider.html5Mode(true);

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js

        $stateProvider
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('tabs.primera', {
                url: "/primera",
                views: {
                    'primera': {
                        templateUrl: "templates/rachas.html",
                        controller: 'rachasPrimeraCtrl'
                    }
                }
            })
            .state('tabs.tips', {
                url: "/tips",
                views: {
                    'tips': {
                        templateUrl: "templates/aciertos.html",
                        controller: 'aciertosCtrl',
                        access: {
                            requiredLogin: true
                        }
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('detailRates', {
                url: '/detailRates',
                templateUrl: 'templates/detailRates.html',
                controller: 'detailRatesCtrl',
                params: {myParam: null},
                cache: false
            }).state('detailMatch', {
                url: '/detailMatch',
                templateUrl: 'templates/detailMatch.html',
                controller: 'detailMatchCtrl',
                params: {myParam: null},
                cache: false
            });



        //Pagina por defecto si no hay match

      $urlRouterProvider.otherwise('/tab/tips');

/*        $urlRouterProvider.otherwise(function($injector, $location){
            var state = $injector.get('$state');
            state.go("tabs.primera", $location.search()); // here we get { query: ... }
            console.log($location.path());
            return $location.path();
        });*/

    });


app.filter('orderByKey', function () {
    return function(obj, field, reverse) {
        var arr=[];
        console.log(field);
        arr = Object.keys(obj)
            .map(function (key) { return obj[key] })
            .sort(function(a,b) { return a > b; } );
        if(reverse) arr.reverse();
        return arr;
    };
});

app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});


