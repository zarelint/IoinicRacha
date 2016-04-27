'use strict';

var social_config = {
    url:         'https://play.google.com/store/apps/details?id=com.ionicframework.racha854942',
    title:       'Visual Betting',
    description: 'Visual Betting is an application based on a statistical analysis algorithm football all countries that helps you make your most profitable bets.',
    image:       'resources/icon.png',
    email:       'visualbetting@gmail.com'
};
if (!mMedia){
    var mMedia = false;
}

var app=angular.module('app',
    ['ionic', 'http-auth-interceptor','ngStorage','pascalprecht.translate'])
    .run(function($ionicPlatform,$translate) {
        $ionicPlatform.ready(function() {
          if( navigator && navigator.splashscreen )
              navigator.splashscreen.hide();

          if(typeof navigator.globalization !== "undefined") {
              navigator.globalization.getPreferredLanguage(function(language) {
                  $translate.use((language.value).split("-")[0]).then(function(data) {
                     // console.log("SUCCESS Language-> " + data);
                      moment.locale($translate.proposedLanguage());
                  }, function(error) {
                      //console.log("ERROR -> " + error);
                  });
              }, null);
          }


            //$translate.use("en");
            moment.locale($translate.proposedLanguage());

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

          if(window.Connection) {
              if(navigator.connection.type == Connection.NONE) {
                  $ionicPopup.confirm({
                          title: "Internet Disconnected"
                      })
                      .then(function(result) {
                          if(!result) {
                              ionic.Platform.exitApp();
                          }
                      });
              }
          }

            var ad_units = {
              android : {
                  banner : "221288",
                  interstitial : "221289"
              }
          };
            var adid =  ad_units.android ;

            //Show a default banner at bottom
            if (mMedia) mMedia.createBanner({
                adId: adid.banner,
                autoShow: true,
                overlap: false,
                position: mMedia.AD_POSITION.BOTTOM_CENTER
            });


      });
    })
    .config(function($httpProvider,$logProvider) {
        $httpProvider.defaults.cache = true;
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $logProvider.debugEnabled(true);
    })
    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

        $translateProvider
            .useStaticFilesLoader({
                prefix: 'locales/',
                suffix: '.json'
            })
            //.registerAvailableLanguageKeys(['en','de','fr','it','es'], {
            .registerAvailableLanguageKeys(['en','de','fr','es'], {
                'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
                'de' : 'de', 'de_DE': 'de', 'de_CH': 'de',
                'fr' : 'fr', 'fr-CA': 'fr', 'fr-FR': 'fr',
              //  'it' : 'it', 'it-CH': 'it', 'it-IT': 'it',
                'es' : 'es',
                '*': 'en'
            })
            .determinePreferredLanguage().fallbackLanguage('en')
            .useSanitizeValueStrategy('escapeParameters');

    })
    .config(function($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
          $ionicConfigProvider.navBar.alignTitle('center');
        // Use native scrolling on Android
        if(ionic.Platform.isAndroid()) $ionicConfigProvider.scrolling.jsScrolling(false);
    }).constant("myconf", {
        //  "url": "https://rachanode-jvillajos.c9users.io"
        //  "url": "http://localhost:8080"
        //  "url": "http://nodejs-rachas.rhcloud.com"
        "url": "http://visualbetting-rachas.rhcloud.com"
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
                templateUrl: "templates/menu.html",
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
                templateUrl: 'templates/login.html'
            })
            .state('detailRates',       {
                url: '/detailRates',
                templateUrl: 'templates/detail/detailRates.html',
                controller: 'detailRatesCtrl',
                params: {myParam: null},
                cache: true
            })
/*            .state('detailMatch',       {
                url: '/detailMatch',
                templateUrl: 'templates/detail/detailMatch_points.html',
                controller: 'detailMatchCtrl',
                params: {myParam: null},
                cache: false
            })*/
            .state('detailMatch_gol',   {
                url: '/detailMatch_gol',
                templateUrl: 'templates/detail/detailMatch_gol.html',
                controller: 'detailMatchCtrl_gol',
                params: {myParam: null},
                cache: false
            });

        //Pagina por defecto
     $urlRouterProvider.otherwise('/tab/ligas');



    })
    .directive('dividerCollectionRepeat', function($parse) {
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
    //,duration:10000
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


app.filter('addBall', function () {
    return function (item) {
        var equipos = item.split('/');
        return equipos[0] +'&nbsp<i class="icon ion-ios-football"></i>&nbsp' + equipos[1];
    };
});
app.directive('positionBarsAndContent', function($timeout) {

    return {

        restrict: 'AC',

        link: function(scope, element) {

            var offsetTop = 0;

            // Get the parent node of the ion-content
            var parent = angular.element(element[0].parentNode);

            // Get all the headers in this parent
            var headers = parent[0].getElementsByClassName('bar');

            // Iterate through all the headers
            for(var x=0;x<headers.length;x++)
            {
                // If this is not the main header or nav-bar, adjust its position to be below the previous header
                if(x > 0) {
                    headers[x].style.top = offsetTop + 'px';
                }

                // Add up the heights of all the header bars
                offsetTop = offsetTop + headers[x].offsetHeight;
            }

            // Position the ion-content element directly below all the headers
            element[0].style.top = offsetTop + 'px';

        }
    };
});
app.filter('groupByDayMonthYear2', function() {
    return memoize(function(input) {
        var asociame = {};
        var dividers = {},item,liga;
        if (!input || !input.length) return;

        var output = [], currentDate;
        for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
            currentDate = moment(item.fecha,'YYYY MM DD').format('DD MMM YYYY');
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
            var date1  =moment(item1, 'DD MMM YYYY').toDate();
            var date2  =moment(item2, 'DD MMM YYYY').toDate();
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

            for ( liga in asociame[fecha]) {
                output.push( {
                    isDivider: true,
                    divider: liga,
                    tipodiv: 'liga',
                    tipo:asociame[fecha][liga][0].tipo,
                    liga:asociame[fecha][liga][0].liga,
                    rate:asociame[fecha][liga][0].rate,
                    jornada: asociame[fecha][liga][0].jornada,
                    flag_id: asociame[fecha][liga][0].flag_id
                });

                for (var index in asociame[fecha][liga]) {
                    output.push(asociame[fecha][liga][index]);
                }
            }
        }


        return output;
    });

});



