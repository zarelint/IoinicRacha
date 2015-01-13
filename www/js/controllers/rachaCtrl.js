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

  $scope.predecir = function () {
    console.log($scope.selection.length);
  };

  $scope.selection=[];

  $scope.selecionarEquipo = function selecionarEquipo(equipo) {
    var idx = $scope.selection.indexOf(equipo);
    // estaba ya seleccionado, la deseleccion implica quitarlo from $scope.selection array.
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }
    // añadir
    else {
      $scope.selection.push(equipo);
    }

  };



});
