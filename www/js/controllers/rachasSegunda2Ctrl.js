'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('rachasSegundaCtrl', function (getResultados, $scope, getRacha, $ionicModal, $http) {

    //Tener un servidor propio permiter usar datos procesados y actualizados
    // $http.get('http://nodejs-rachas.rhcloud.com/RachasSegunda',{ cache: true}).
    $http.get('RachasSegunda.json',{ cache: true}).
        //$http.get('http://localhost:8080/RachasSegunda',{ cache: true}).
        success(function(data) {
            $scope.racha = data[0];
        });


    /**
     * Definicicion dialogo CompareDialog
     */
    $ionicModal.fromTemplateUrl('templates/compareDialog.html', {
        scope: $scope,
        animation: 'slide-in-up',
        cerrar: function(){


            for ( var equipo in $scope.racha.calendario ){
                $scope.racha.calendario[equipo].checked = false;
            }
            $scope.selection=[];
            this.hide();
        }
    }).then(function(modal) {
        $scope.compareDialog2 = modal;
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

        $scope.compareDialog2.show();
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
