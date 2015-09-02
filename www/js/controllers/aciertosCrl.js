'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('aciertosCtrl', function ($scope, $http,_,$ionicSlideBoxDelegate, $location, $ionicHistory) {
    //Tener un servidor propio permiter usar datos procesados y actualizados
    //$http.get('http://nodejs-rachas.rhcloud.com/Pliga').
    $http.get('Pliga.json').
   // $http.get('http://localhost:8080/Pliga',{ cache: true}).

        success(function(data) {
            $scope.predicciones =  data;
        });

        $scope.ultimos = [  {date:'Sep 14', partido1:'Criciuma EC',res:'1-1',partido2:'Botafogo'},
                            {date:'Sep 14', partido1:'Criciuma EC',res:'1-1',partido2:'Botafogo'},
                            {date:'Sep 14', partido1:'Botafogo',res:'6-0',partido2:'Botafogo'},
                            {date:'Sep 14', partido1:'Botafogo',res:'3-0',partido2:'Botafogo'},
                            {date:'Sep 14', partido1:'Criciuma EC',res:'1-2',partido2:'Botafogo'},
                            {date:'Sep 14', partido1:'Botafogo',res:'1-1',partido2:'Botafogo'}
        ];

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
                $location.path("/login");
            }



        }




        $scope.status = "Making it this far means you are signed in";


});
