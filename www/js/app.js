'use strict';
var requestToken = "";
var accessToken = "";
var clientId = '321359984550-9otvkbcpbk6kj52e4i5oih5mkrdamnlp.apps.googleusercontent.com';
var clientSecret = "BilFKZS3JiNAkgqk8PobtnUX";


var app=angular.module('app', ['ionic','underscore'])
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
            .state('tabs.segunda', {
                url: "/segunda",
                views: {
                    'segunda': {
                        templateUrl: "templates/rachas2.html",
                        controller: 'rachasSegundaCtrl'
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

            });





        //Pagina por defecto si no hay match

      $urlRouterProvider.otherwise('/tab/primera');

/*        $urlRouterProvider.otherwise(function($injector, $location){
            var state = $injector.get('$state');
            state.go("tabs.primera", $location.search()); // here we get { query: ... }
            console.log($location.path());
            return $location.path();
        });*/

    });



    app.filter('sumByKey', function() {
        return function(data) {

            if ( !data ){
                return false;
            }

            var sum = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                sum += parseInt(data[i]);
            }

            return (sum/data.length).toFixed(2);
        };
    });

