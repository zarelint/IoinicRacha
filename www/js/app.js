'use strict';

//var accessToken = "";

var app=angular.module('app',
    ['ionic', 'http-auth-interceptor','ngStorage'])
    .run(function($ionicPlatform,$rootScope) {
/*        $rootScope.$on('$stateChangeStart',function(){
         $rootScope.stateIsLoading = true;
         });


         $rootScope.$on('$stateChangeSuccess',function(){
         $rootScope.stateIsLoading = false;
         });*/
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

          var ad_units = {
              android : {
                  banner : "221288",
                  interstitial : "221289"
              }
          };
          var adid =  ad_units.android ;
// or, show a default banner at bottom
          if(mMedia) mMedia.createBanner({
              adId : adid.banner,
              autoShow : true,
              overlap : true,
              position : mMedia.AD_POSITION.BOTTOM_CENTER
          });


      });

    })

    .config(function($httpProvider) {
        $httpProvider.defaults.cache = true;
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })

    .config(function($ionicConfigProvider) {
          $ionicConfigProvider.navBar.alignTitle('center');
        // Use native scrolling on Android
        if(ionic.Platform.isAndroid()) $ionicConfigProvider.scrolling.jsScrolling(false);
    }).constant("myconf", {
         // "url": "https://rachanode-jvillajos.c9users.io"
        // "url": "http://localhost:8080"
         "url": "http://nodejs-rachas.rhcloud.com"

    })
    .config(function($httpProvider,$stateProvider, $urlRouterProvider) {
        //añadir el idtoken en todas las request
        $httpProvider.interceptors.push('TokenInterceptor');

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js

        $stateProvider
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                controller: 'AppCtrl'
            })
                .state('tabs.ligas', {
                    url: "/ligas",
                    views: {
                        'ligas': {
                            templateUrl: "templates/ligas.html",
                            controller: 'LigasCtrl',
                            cache: true
                        }
                    }
                })
                .state('tabs.historial', {
                    url: "/historial",
                    views: {
                        'historial': {
                            templateUrl: "templates/historial.html",
                            controller: 'historialCtrl',
                            access: {
                                requiredLogin: true
                            },
                            cache: true
                        }
                    }
                })
                .state('tabs.vip', {
                    url: "/vip",
                    views: {
                        'vip': {
                            templateUrl: "templates/vip.html",
                            controller: 'vipCtrl',
                            cache: true
                        }
                    }
                })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('detailRates',       {
                url: '/detailRates',
                templateUrl: 'templates/detail/detailRates.html',
                controller: 'detailRatesCtrl',
                params: {myParam: null},
                cache: true
            })
            .state('detailMatch',       {
                url: '/detailMatch',
                templateUrl: 'templates/detail/detailMatch_points.html',
                controller: 'detailMatchCtrl',
                params: {myParam: null},
                cache: false
            })
            .state('detailMatch_gol',   {
                url: '/detailMatch_gol',
                templateUrl: 'templates/detail/detailMatch_gol.html',
                controller: 'detailMatchCtrl_gol',
                params: {myParam: null},
                cache: false
            });


        //Pagina por defecto si no hay match

      $urlRouterProvider.otherwise('/tab/historial');

/*        $urlRouterProvider.otherwise(function($injector, $location){
            var state = $injector.get('$state');
            state.go("tabs.primera", $location.search()); // here we get { query: ... }
            console.log($location.path());
            return $location.path();
        });*/

    }).directive('dividerCollectionRepeat', function($parse) {
        return {
            priority: 1001,
            compile: compile
        };

        function compile (element, attr) {
            var height = attr.itemHeight || '73';
            attr.$set('itemHeight', 'item.isDivider ? 37 : ' + height);


            element.children().attr('ng-hide', 'item.isDivider');
            element.prepend(
                '<div class="item item-divider ng-hide" ng-show="item.isDivider" ng-bind="item.divider"></div>'
            );
        }
    });


app.filter('groupBy', function ($timeout) {
    return function (data, key) {
        if (!key) return data;
        var outputPropertyName = '__groupBy__' + key;
        if(!data[outputPropertyName]){
            var result = {};
            for (var i=0;i<data.length;i++) {
                if (!result[data[i][key]])
                    result[data[i][key]]=[];
                result[data[i][key]].push(data[i]);
            }
            Object.defineProperty(data, outputPropertyName, {enumerable:false, configurable:true, writable: false, value:result});
            $timeout(function(){delete data[outputPropertyName];},0,false);
        }
        return data[outputPropertyName];
    };
});

app.constant('$ionicLoadingConfig', {
    template: '<ion-spinner icon="ios" class="light"></ion-spinner><br/><span>Loading...</span>'
});

var has = function has(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
};

var  memoize = function(func, hasher) {
    var memoize = function(key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!has(cache, address)) cache[address] = func.apply(this, arguments);
        return cache[address];
    };
    memoize.cache = {};
    return memoize;
};

app.filter('groupByDayMonthYear2', function() {

    return memoize(function(input) {
        var asociame = {};
        var dividers = {},item,liga;
        if (!input || !input.length) return;

        var output = [], currentDate;
        for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
            currentDate = moment(item.fecha).format('DD MMM YY');
            if (!asociame[currentDate]) {
                asociame[currentDate] = {};
            }
            if (!asociame[currentDate][item.tipo]) {
                asociame[currentDate][item.tipo] = [];
            }

            asociame[currentDate][item.tipo].push(item);
        }

        var fechaKeys =  Object.keys(asociame);
        fechaKeys.sort(function (item1, item2) {
            var date1 = new Date(item1);
            var date2 = new Date(item2);
            if (date1 < date2)
                return 1;
            if (date1 > date2)
                return -1;
            return 0;
        });
        for (var indexfecha in fechaKeys) {
            var fecha = fechaKeys[indexfecha];
            output.push( {
                isDivider: true,
                divider: fecha,
                tipodiv: 'fecha'

            });

            for (var liga in asociame[fecha]) {
                output.push( {
                    isDivider: true,
                    divider: liga,
                    tipodiv: 'liga',
                    liga:asociame[fecha][liga][0].tipo,
                    rate:asociame[fecha][liga][0].rate,
                    jornada: asociame[fecha][liga][0].jornada
                });

                for (var index in asociame[fecha][liga]) {
                    output.push(asociame[fecha][liga][index]);
                }
            }
        }


        return output;
    });

});



