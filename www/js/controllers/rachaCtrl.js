'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller:rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('rachaCtrl', function (getResultados, $scope, getRacha, $ionicModal) {
  //TODO usar los datos de FireBase
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


  /**
   * Definicicion dialogo CompareDialog
   */
  $ionicModal.fromTemplateUrl('templates/compareDialog.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.compareDialog = modal;
  });


  $scope.package = {};


  /**
   * Funcion comparar
   * Muestra en el cuadro de dialogo los datos de los equipos
   */
  $scope.comparar = function comparar() {
    /**
     *  Muestra un mensaje de error
     */
    if ( $scope.selection.length !== 2 ){
      $scope.mostrarDialog = true;
      $scope.package.errorDialog='Deben estar seleccionados 2 equipos';
    }else{
      $scope.mostrarDialog = false;
    }

    $scope.compareDialog.show();
  };

  $scope.selection=[];
  /**
   * Metodo invocado cada vez que hace click en un check, para copiar el equipo seleccionado e
   * en el array 'selection'
   * @param equipo
   */
  $scope.selecionarEquipo = function selecionarEquipo(equipo) {
    var idx = $scope.selection.indexOf(equipo);
    // estaba ya seleccionado, la deseleccion implica quitarlo from $scope.selection array.
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }
    // añadirlo
    else {
      $scope.selection.push(equipo);
    }

  };



});
