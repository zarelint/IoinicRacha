'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('aciertosCtrl', function ($scope, $http,$ionicSlideBoxDelegate, $location, $ionicHistory, detailMatch) {
    //Tener un servidor propio permiter usar datos procesados y actualizados
    //$http.get('http://nodejs-rachas.rhcloud.com/Pliga').

     //$http.get('Pliga.json').
     $http.get('prediccion.json').
    // $http.get('http://nodejs-rachas.rhcloud.com/prediccion',{ cache: true}).
   // $http.get('http://localhost:8080/Pliga',{ cache: true}).

        success(function(data) {
            $scope.predicciones =  data.pred;
            $scope.ratesLigasX =  data.ratesLigasX; // obj[francia2][0] obj[francia2][2]
            $scope.ratesLigas1 =  data.ratesLigas1;
            //  ratesLigasX[prop] = [ ratesLigas[3], param, ratesLigas[1] ];
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
/*          // todo lo levanto en un modal?
            if (liga.indexOf('singles') > -1){
                $location.path("/detailRates/"+ $scope.ratesLigas1[liga]);
            }else if (liga.indexOf('dobles') > -1){
                $location.path("/detailRates/"+ $scope.ratesLigasX[]);
            }*/
        };

    // todo ir al panel control
         $scope.verEncuentro = function(item) {
        //
             var liga= item.tipo;
             var ligaparsed= item.liga;
             var equipos = item.encuentro.split('-');
             var equipo1= equipos[0];
             var equipo2= equipos[1];

             detailMatch.equipo1 = equipo1;
             detailMatch.equipo2 = equipo2;
             detailMatch.liga = ligaparsed;

             $location.path("/detailRates");



             //console.log(equipo1);
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
                    disableAnimate: true,
                    disableBack: true
                });

                // Si no encuentra token redirecciono al login
               // $location.path("/login");
            }



        }




        $scope.status = "Making it this far means you are signed in";


});
