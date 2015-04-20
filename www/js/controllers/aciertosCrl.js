'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('aciertosCtrl', function (getResultados, $scope, getRacha, $ionicModal, $http) {

    //Tener un servidor propio permiter usar datos procesados y actualizados
    $http.get('http://nodejs-rachas.rhcloud.com/ResultadosPrimera').

        success(function(data) {
          var prediccionJornada=   getRacha.GetPrediccion(data[0],data[1],5 );

        });




    $scope.scoreClass = function(scores) {
        var clase ='';
        if (scores === 0) {
            clase= 'empate';
        } else if (scores === 1) {
            clase= 'victoria';
        } else if (scores ===-1){
            clase= 'derrota';
        }
        else {
            clase= '';
        }
        return clase;
    };





});
