'use strict';

app.controller('vipCtrl', function (  $ionicPopup, $window,$localStorage,$translate,googleLogin,$ionicModal,VipService, $log,LigaService, $state, $scope, $http,$ionicSlideBoxDelegate, $location, $ionicHistory, detailMatch) {
    function esPar(num) {
        return num % 2;
    }
    $scope.vip=$localStorage.ngStorageVIP;
    $scope.$on("$ionicView.loaded", function(event, data){

        $scope.doRefresh();
    });
    
    $scope.subcripcion = function(){
        googleLogin.startLogin(true);
    };
    $scope.$on("$ionicView.enter", function(event, data){
       
        $localStorage.mostrados++;
       // console.log($localStorage.mostrados);
       // console.log($localStorage.ngStorageVIP);
        if (  HeyzapAds && $localStorage.mostrados >2 && esPar($localStorage.mostrados)
                && $localStorage.mostrados < 8 && !$localStorage.ngStorageVIP   ){
            $log.debug('Heyzap deberia estar mostrando anuncio');

            HeyzapAds.InterstitialAd.show().then(function () {
                $log.debug('existe');
                return HeyzapAds.InterstitialAd.fetch();
            }, function(error) {
                $log.debug('error'+error);
            });
        }
    });



    $scope.filtrarDate = function(fecha) {
        return moment(fecha,'DD MMM DDDD').isAfter(moment().subtract(1,'days'),'day');
    };

    $scope.filtrarDate2 = function(fecha) {
        return moment(fecha,'DD MM YYYY').isSame(moment(), "day");
    };

    //Tener un servidor propio permiter usar datos procesados y actualizados
    $scope.doRefresh = function () {
        //clear all data  Forzaba esto porque sino no se cargan las ligas again
        LigaService.clearAll();

        VipService.getdata(true).then(function(items){
            $scope.day =  items.day;
            $scope.dayFormatted =  moment(items.day.fecha, 'DD MM YYYY').format("DD MMM").slice(0, -1);
            $scope.predicciones =  items.pred;
            $scope.ratesLigasX =  items.ratesLigasX;
            $scope.ratesLigas1 =  items.ratesLigas1;
            var keys = Object.keys(items.pred);

            keys.sort(function (item1, item2) {
                var date1  =moment(item1, 'DD MMM dddd').toDate();
                var date2  =moment(item2, 'DD MMM dddd').toDate();
                if (date1 < date2)
                    return -1;
                if (date1 > date2)
                    return 1;
                return 0;
            });

            $scope.listaFechas = keys;
        });


        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');


    };

    VipService.getdata(false).then(function(items){

        $scope.predicciones =  items.pred;
        $scope.ratesLigasX =  items.ratesLigasX;
        $scope.ratesLigas1 =  items.ratesLigas1;
        $scope.day =  items.day;
        $scope.dayFormatted =  moment(items.day.fecha, 'DD MM YYYY').format("DD MMM").slice(0, -1);
        
        
        var keys = Object.keys(items.pred);

        keys.sort(function (item1, item2) {
            var date1  =moment(item1, 'DD MMM dddd').toDate();
            var date2  =moment(item2, 'DD MMM dddd').toDate();

            if (date1 < date2)
                return -1;
            if (date1 > date2)
                return 1;
            return 0;
        });

        $scope.listaFechas = keys;
    });
    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function(group) {
        
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            /*
               if (HeyzapAds){
                HeyzapAds.VideoAd.show().then(function() {
                    return HeyzapAds.VideoAd.fetch();
                });
               if (group==='betday'){
                    HeyzapAds.IncentivizedAd.show().then(function() {
                        return HeyzapAds.IncentivizedAd.fetch();
                    });
                }else{
                    HeyzapAds.VideoAd.show().then(function() {
                        return HeyzapAds.VideoAd.fetch();
                    });
                }
            }*/

            $ionicSlideBoxDelegate.update();
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

    $scope.ver = function(liga) {
        if (liga.indexOf('singles') > -1){
            $state.go('detailRates', {myParam: $scope.ratesLigas1[liga.substr(0,liga.indexOf('singles'))]});
        }else if (liga.indexOf('dobles') > -1){
            $state.go('detailRates', {myParam: $scope.ratesLigasX[liga.substr(0,liga.indexOf('dobles'))]});
        }else if (liga ==='betday'){
            $state.go('simpleRates', {myParam:  $scope.day} );
        }else if ( liga==='x'){
            var confirmPopup = $ionicPopup.alert({
                title: $translate.instant('Manual Bets'),
                template: $translate.instant('Add by colaborators tipster' +
                    '<br>No rates neither historial data available')
            });
        }

    };


    // preppare and load ad resource in background, e.g. at begining of game level
    //if(mMedia) mMedia.prepareInterstitial( {adId:adid.interstitial, autoShow:false} );
    $scope.verEncuentro = function(item) {
        
        $log.debug('mostrados ng :'+ $localStorage.mostrados);
        $log.debug("vipCtrl-VerEncuentro: Mostrando intersticial");
        
        var liga= item.tipo;
        var ligaparsed= item.liga;
        var equipos = item.encuentro.split('/');
        var equipo1= equipos[0];
        var equipo2= equipos[1];
        detailMatch.jornada = item.jornada;
        detailMatch.equipo1 = equipo1;
        detailMatch.equipo2 = equipo2;
        detailMatch.liga = ligaparsed;
        detailMatch.prediccion = item.prediccion;
        detailMatch.from = 'tabs.vip';
        if (liga.indexOf('singles') > -1){
            detailMatch.algodesc = LigaService.getAlgo($scope.ratesLigas1[liga.substr(0,liga.indexOf('singles'))]);
        }else if (liga.indexOf('dobles') > -1){
            detailMatch.algodesc = LigaService.getAlgo($scope.ratesLigasX[liga.substr(0,liga.indexOf('dobles'))]);
        }
        $state.go('detailMatch_gol', {myParam: detailMatch});
        //$state.transitionTo('detailRates', {myParam: detailMatch} , { reload: true, inherit: true, notify: true });//reload
        //$location.path("/detailRates");      $state.go($state.currentState, {}, {reload:true});
    };


});
