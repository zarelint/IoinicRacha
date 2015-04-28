'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('rachaCtrl', function (getResultados, $scope, getRacha, $ionicModal, $http) {

    //Tener un servidor propio permiter usar datos procesados y actualizados
    $http.get('http://nodejs-rachas.rhcloud.com/Datosrachas').
        success(function(data) {
             $scope.racha = data[0];
        });

/*   Esto opcion no es util porque tenemos que recargar los datos en Firebase antes de usar la app
      getResultados.loadData().then(function(data) {
          //Subir a firebase
          Post.create(getRacha.GetRachasCalendario(data[0]));
          $http.get('https://boiling-fire-888.firebaseio.com/posts/-JgIys2uB4ltcf5WpbD1.json').
              success(function(data) {
                $scope.racha = data;
          });
      }
*/


  /**
   * Definicicion dialogo CompareDialog
   */
  $ionicModal.fromTemplateUrl('templates/compareDialog.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.compareDialog = modal;
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
