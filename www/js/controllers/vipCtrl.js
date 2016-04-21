'use strict';

app.controller('vipCtrl', function ($translate,googleLogin,$ionicModal,VipService, $log,LigaService, $state, $scope, $http,$ionicSlideBoxDelegate, $location, $ionicHistory, detailMatch) {

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

    // preppare and load ad resource in background, e.g. at begining of game level
    //if(mMedia) mMedia.prepareInterstitial( {adId:adid.interstitial, autoShow:false} );
    $scope.verEncuentro = function(item) {
        // show the interstitial later, e.g. at end of game level

        if(mMedia) mMedia.prepareInterstitial( {adId:'221289', autoShow:true} );

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
        // $location.path("/detailRates");      $state.go($state.currentState, {}, {reload:true});
    };

    // si el Password is not set redirigo  a la pantalla de login

/*
    //NO hay accessToken
    if(accessToken === "" || !accessToken) {

        // intento  buscarlo en la cache
        if( window.localStorage.getItem("access_token") !== null) {
            accessToken = window.localStorage.getItem("access_token");
            console.log( 'Se detecta el accessToken '+accessToken);
            //todo temporal para que siempre me lo pida en futuros si esta cadudcado pedir un resfres con esto
            window.localStorage.removeItem("access_token");
        }else{
            //desahila marcha atras
            $ionicHistory.nextViewOptions({
                disableAnimate: true
                //, disableBack: true
            });

            // Si no encuentra token redirecciono al login
            // $location.path("/login");
        }


 }
    */
    //googleLogin.startLogin();


});
