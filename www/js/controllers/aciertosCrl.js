'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('aciertosCtrl', function ($scope, $http,_) {
    //Tener un servidor propio permiter usar datos procesados y actualizados
    //$http.get('http://nodejs-rachas.rhcloud.com/Pliga').
    $http.get('Pliga.json').
   // $http.get('http://localhost:8080/Pliga',{ cache: true}).

        success(function(data) {

            $scope.predicciones =  data;

/*            $scope.predicciones = {
                '18 julio': [{liga: 'bread1',partido: 'butter1',ligaRate:'55%',jorEstimada:13}],
                '21 julio': [{liga: 'bread1',partido: 'butter1',ligaRate:'55%',jorEstimada:13}]
            };*/


            /*
             * if given group is the selected group, deselect it
             * else, select the given group
             */
            $scope.toggleGroup = function(group) {
                if ($scope.isGroupShown(group)) {
                    $scope.shownGroup = null;
                } else {
                    $scope.shownGroup = group;
                }
            };
            $scope.isGroupShown = function(group) {
                return $scope.shownGroup === group;
            };

        });





});
