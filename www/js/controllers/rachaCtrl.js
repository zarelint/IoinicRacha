'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller:rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('rachaCtrl', function (getResultados, $scope, getRacha) {

    getResultados.loadData().then(function(data) {
      $scope.racha = getRacha.GetRachasCalendario(data[0]);

      $scope.scoreClass = function(scores) {
        var clase ='';
        if (scores === 0) {
          clase= 'empate';
        } else if (scores === 1) {
          clase= 'victoria';
        } else {
          clase= 'derrota';
        }
        return clase;
      };

    });


});
