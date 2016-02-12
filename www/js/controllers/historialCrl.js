'use strict';


app.controller('historialCtrl', function (HistoricoService, myconf, LigaService, $state, $scope, $http,$ionicSlideBoxDelegate, $location, $ionicHistory, detailMatch) {

    $scope.doRefresh = function () {
        //clear all data
        LigaService.clearAll();

        HistoricoService.getdata(true).then(function(items){
            $scope.predicciones =   items.pred;
            $scope.ratesLigasX =   items.ratesLigasX;
            $scope.ratesLigas1 =   items.ratesLigas1;
        });
        LigaService.getListaLigas(true).then(function(items){
            $scope.ligas = items;
        });
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    };

    HistoricoService.getdata(false).then(function(items){
        $scope.predicciones =  items.pred;
        $scope.ratesLigasX =   items.ratesLigasX;
        $scope.ratesLigas1 =   items.ratesLigas1;
    });

    var ligaSelected;

    LigaService.getListaLigas(false).then(function(items){
        $scope.ligas = items;
    });
/*    $http.get(myconf.url +'/listaligas').
    success(function(data) {
        $scope.ligas = data;
    });*/
    //define data to store liga in combo
    $scope.data = {};
    $scope.data.selectedindex = null;
    $scope.changedliga = function() {
        ligaSelected = $scope.data.selectedindex;
        $scope.ligaSelected = ligaSelected;
    };

    $scope.getHeight = function (check) {
        if (check.tipodiv !== undefined) {
            return 30;
        }else{
            return 50;
        }
    };

    var end = false;
    $scope.loadmore = true;


    // appends the new records to the items scope
    $scope.fetchMore = function() {
        if (end) return;

        var per_page =3;
        var total_pages=  Math.ceil(Object.keys($scope.predicciones).length / per_page);
        var page= total_pages +1;

        $http.get("https://nodejs-rachas.rhcloud.com/prediccion/"+ page).success(function (items) {
            if (items.last === true){
                $scope.loadmore = false;
            }
            if (  Object.keys(items.pred).length !==0) {
                //angular.extend($scope.predicciones, items.pred);
                Array.prototype.push.apply($scope.predicciones, items.pred);
/*                var keys = Object.keys($scope.predicciones);
                keys.sort(function (item1, item2) {
                    var date1 = new Date(item1);
                    var date2 = new Date(item2);
                    if (date1 < date2)
                        return 1;
                    if (date1 > date2)
                        return -1;
                    return 0;
                });
                $scope.listaFechas = keys;*/
            } else {
                end = true;
            }
        }).error(function (err) {
            console.log("Failed to download list items:", err);
            end = true;
        }).finally(function () {
            $scope.$broadcast("scroll.infiniteScrollComplete");
        });
    };

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

        $scope.aciertos={};



        $scope.myFilter = function(item) {

            if ( $scope.aciertos.checked){// $scope.aciertos.checked === true: Devuelve solo los acertados
                return item.real === true;
            }else{
                return item.real !== true;
            }
        };

        $scope.myFilterliga = function(item) {

            if ($scope.data.selectedindex === null) {
                return true;
            } else {
                return item.liga === $scope.data.selectedindex;
            }
        };
         $scope.verEncuentro = function(item) {

             var liga= item.tipo;
             var ligaparsed= item.liga;
             var equipos = item.encuentro.split('/');
             var equipo1= equipos[0];
             var equipo2= equipos[1];
             detailMatch.jornada = item.jornada;
             detailMatch.equipo1 = equipo1;
             detailMatch.equipo2 = equipo2;
               detailMatch.from = 'tabs.historial';
             detailMatch.liga = ligaparsed;

             if (liga.indexOf('singles') > -1){
                 detailMatch.algodesc = LigaService.getAlgo($scope.ratesLigas1[liga.substr(0,liga.indexOf('singles'))]);
             }else if (liga.indexOf('dobles') > -1){
                 detailMatch.algodesc = LigaService.getAlgo($scope.ratesLigasX[liga.substr(0,liga.indexOf('dobles'))]);
             }
             $state.go('detailMatch', {myParam: detailMatch});
             //  $state.transitionTo('detailRates', {myParam: detailMatch} , { reload: true, inherit: true, notify: true });//reload
             // $location.path("/detailRates");
         };
    // si el Password is not set redirigo  a la pantalla de login



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
                   // , disableBack: true
                });

                // Si no encuentra token redirecciono al login
               // $location.path("/login");
            }



        }




        $scope.status = "Making it this far means you are signed in";


});
