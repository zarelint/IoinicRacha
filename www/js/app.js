'use strict';
var app=angular.module('app', ['ionic','underscore'])
    .run(function($ionicPlatform) {
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
    })
    .constant('NUM_JORNADAS', 38)

    .config(function($stateProvider, $urlRouterProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider
          .state('page7', {
            url: '/tabs',
            templateUrl: 'templates/page7.html',
            controller: 'rachaCtrl'
          })
      ;

      // if none of the above states are matched, use this as the fallback

      $urlRouterProvider.otherwise('/tabs');


    });





/*


var app = angular
    .module('iotutorialApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'firebase',
        'underscore'
    ])
    .constant('FIREBASE_URL', 'https://boiling-fire-888.firebaseio.com/')
    .constant('NUM_JORNADAS', 38)
    .constant('url_resultados', 'http://www.marca.com/futbol/primera/resultados.html')
    .constant('url_clasificacion', 'http://www.marca.com/futbol/primera/clasificacion.html')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/post', {
                templateUrl: 'views/post.html',
                controller: 'PostCtrl'
            })
            .when('/', {
                templateUrl: 'views/loaddata.html',
                controller: 'LoaddataCtrl'
            });
    });
*/