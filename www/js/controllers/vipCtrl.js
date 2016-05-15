'use strict';

app.controller('vipCtrl', function ($localStorage,$translate,googleLogin,$ionicModal,VipService, $log,LigaService, $state, $scope, $http,$ionicSlideBoxDelegate, $location, $ionicHistory, detailMatch) {

    $scope.filtrarDate = function(fecha) {
        return moment(fecha,'DD MMM DDDD').isAfter(moment().subtract(1,'days'),'day');
    };

    //Tener un servidor propio permiter usar datos procesados y actualizados
    $scope.doRefresh = function () {
        //clear all data  Forzaba esto porque sino no se cargan las ligas again
        LigaService.clearAll();

        VipService.getdata(true).then(function(items){
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
        }
    };

    function esPar(num) { return num % 2;}

    // preppare and load ad resource in background, e.g. at begining of game level
    //if(mMedia) mMedia.prepareInterstitial( {adId:adid.interstitial, autoShow:false} );
    $scope.verEncuentro = function(item) {

        // show the interstitial....
        $log.debug('mostrados :'+ window.localStorage.getItem("mostrados"));
        $log.debug('mostrados ng :'+ $localStorage.mostrados);
        if(mMedia && esPar($localStorage.mostrados) && $localStorage.mostrados < 16) mMedia.showInterstitial();
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
