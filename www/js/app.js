'use strict';

//variables globales de la app
var social_config = {
    url:         'https://play.google.com/store/apps/details?id=com.ionicframework.racha854942',
    title:       'Visual Betting',
    description: 'Share your Doubts',
    image:       'resources/icon.png',
    email:       'visualbetting@gmail.com'
};
var HeyzapAds;
var inAppPurchase; 
// fin variables globales


var app=angular.module('app',
    ['ionic', 'http-auth-interceptor','ngStorage','pascalprecht.translate'])
    .constant(
        "myconf", {
            //   "url": "http://192.168.1.128:8080"},
            //"url": "http://localhost:8080"},
             "url": "http://visualbetting-rachas.rhcloud.com"},
        '$ionicLoadingConfig', {
               template: '<ion-spinner icon="ios" class="light"></ion-spinner><br/><span>Loading...</span>'}
    )
    .run(function($ionicPlatform,$translate,LigaService,$log,$localStorage,$ionicPopup,$http,myconf,$q) {
        $ionicPlatform.ready(function() {
           // window.iap.setUp(androidApplicationLicenseKey);
          if( navigator && navigator.splashscreen )
              navigator.splashscreen.hide();


          if(typeof navigator.globalization !== "undefined") {
              navigator.globalization.getPreferredLanguage(function(language) {
                  $translate.use((language.value).split("-")[0]).then(function(data) {
                      $log.debug("SUCCESS Language-> " + data);
                      moment.locale($translate.proposedLanguage());
                  }, function(error) {
                      $ionicPopup.alert({
                          title: 'Language not detected',
                          template: 'send the error to support'+error
                      });
                  });
              }, null);
          }


            if (window.plugins != undefined) {
                var validado=false;
                var promises = [];

                inAppPurchase
                    .restorePurchases()
                        .then(function (purchases) {
                            function noSuscripto() {
                                $log.debug('Heyzap Activado:');
                                HeyzapAds.start("518fc13d26fd390e114298a24e0291c0", new HeyzapAds.Options({disableAutomaticPrefetch: true})).then(function () {
                                    HeyzapAds.InterstitialAd.fetch();
                                    $log.debug('heyzap arrancado');
                                    // return HeyzapAds.showMediationTestSuite(); // returns a Promise
                                }, function (error) {
                                    $log.debug('Error Heyzap start' + error);
                                });
                                $localStorage.ngStorageVIP = false;
                            }
                            $log.debug('ver compras usuario:'+JSON.stringify(purchases));
                            if (purchases.length ==0){ // No compras
                                noSuscripto();
                            }else{//Revisar todos los items comprados
                                purchases.forEach(function(element) {
                                    var googleReceipt = {
                                        data: element.receipt,
                                        signature: element.signature
                                    };
                                    var receipt = JSON.parse(element.receipt);
                                    var prom = $http.post(myconf.url + '/validate', googleReceipt);
                                    promises.push(prom);
                                });
                                $q.all(promises).then(function (res) {
                                    res.some(function(element) {
                                        $log.debug('sub valida:' + element.data.valida);
                                        if (element.data.valida) {
                                            validado =true;
                                            return true; //short-circuiting the execution of the rest.
                                        }
                                    });
                                    if (validado) {
                                        $log.debug('Heyzap Eliminiado:');
                                        HeyzapAds = false;
                                        $localStorage.ngStorageVIP = true;
                                    } else {
                                        noSuscripto();
                                    }

                                });
                            }
                        })
                    .catch(function (err) {
                        $log.debug('google play plugin '+ err);
                        $ionicPopup.alert({
                            title: 'Something went wrong',
                            template: 'We can not connect with google play to check your subscription'
                        });
                });
            }


            //$translate.use("en");
            moment.locale($translate.proposedLanguage());

            var notificationOpenedCallback = function(jsonData) {
                if (jsonData.additionalData.test){
                    LigaService.clearAll();
                }
            };
            
            if (window.plugins != undefined){
                window.plugins.OneSignal
                    .startInit("3995804c-fb96-4bf9-bd75-372124e08ee2", "321359984550")
                    .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
                    .endInit();

            }


            
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            // Check for network connection
            if(navigator.connection) {
                if(navigator.connection.type == "none") {
                    $ionicPopup.confirm({
                            title: 'No Internet Connection',
                            content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
                        })
                        .then(function(result) {
                            if(!result) {
                                ionic.Platform.exitApp();
                            }
                        });
                }
            }

                $http.get(myconf.url+'/getVersion').then(function(res) {
                    var version = "0.2.17";
                    if(res.data!==version){
                        $ionicPopup.confirm({
                                title: 'Old App Version',
                                content: 'Update to the last version'+res.data
                            })
                            .then(function(result) {
                                if(!result) {
                                    ionic.Platform.exitApp();
                                }
                            });
                    }
                });




      });
    })
    .config(function($httpProvider,$logProvider) {
        $httpProvider.defaults.cache = true;
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $logProvider.debugEnabled(false);
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
                            cache: false
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
            .state('simpleRates',       {
                url: '/simpleRates',
                templateUrl: 'templates/detail/simpleRates.html',
                controller: 'simpleRatesCtrl',
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
app.filter('groupBy', function ($timeout) {
    //return memoize(function(data, key) {
    return function (data, key) {
        if (!key ) return data;
        if (!data ) return;
        var outputPropertyName = '__groupBy__' + key;
        if( !data[outputPropertyName] ){
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
    }
});
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

