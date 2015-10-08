'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('rachasPrimeraCtrl', function ( $scope, $ionicModal, $http) {

    var ligaSelected ;
    //$http.get('http://nodejs-rachas.rhcloud.com/RachasPrimera',{ cache: true}).
    // $http.get('RachasPrimera.json',{ cache: true}).
    //  $http.get('http://localhost:8080/ligas',{ cache: true}).
    $http.get('ligas.json',{ cache: true}).
    //$http.get('http://nodejs-rachas.rhcloud.com/ligas',{ cache: true}).
    // $http.get('http://localhost:8080/RachasPrimera').
        success(function(data) {
             $scope.ligas = [];
             $scope.racha = data;

             for (var liga in data){
                 $scope.ligas.push(liga);
                 $scope.racha[liga].calendarioFiltered =  angular.copy($scope.racha[liga].calendario) ;
                 $scope.racha[liga].difGolFiltered =      angular.copy($scope.racha[liga].difGol);
                 $scope.racha[liga].difPuntosFiltered =   angular.copy($scope.racha[liga].difPuntos);
                 $scope.racha[liga].casaFiltered =          angular.copy($scope.racha[liga].casa);
                 $scope.racha[liga].fueraFiltered =     angular.copy($scope.racha[liga].fuera);
                 $scope.racha[liga].difPuntosCasaFiltered =   angular.copy($scope.racha[liga].difPuntosCasa);
                 $scope.racha[liga].difPuntosFueraFiltered =   angular.copy($scope.racha[liga].difPuntosFuera);




             }

             $scope.items = $scope.ligas;
             $scope.data = {};
             $scope.igualdad = [null,10,9,8,7,6,5,4,3,2,1,0];
             $scope.data.selectedindex = 1;
             $scope.data.selectedindex2 = 1;
             $scope.data.selectedindexEquipo0 = 1;
             $scope.data.selectedindexEquipo1 = 1;

             ligaSelected = $scope.items[1];
        });



    $scope.changedliga = function() {
         ligaSelected = $scope.items[$scope.data.selectedindex];
    };

    $scope.changedIgualdadEquipo = function changedIgualdadEquipo(equipo,tipo) {
        var filterValue = null;
        if (tipo ==='Equipo0'){
             filterValue = $scope.igualdad[$scope.data.selectedindexEquipo0];
        }else{
             filterValue = $scope.igualdad[$scope.data.selectedindexEquipo1];
        }

        // Clear previous filters
        $scope.racha[ligaSelected].calendarioFiltered[equipo] =  angular.copy($scope.racha[ligaSelected].calendario[equipo]) ;
        $scope.racha[ligaSelected].difGolFiltered[equipo] =      angular.copy($scope.racha[ligaSelected].difGol[equipo]);
        $scope.racha[ligaSelected].difPuntosFiltered[equipo] =       angular.copy($scope.racha[ligaSelected].difPuntos[equipo]);
        $scope.racha[ligaSelected].casaFiltered[equipo] =           angular.copy($scope.racha[ligaSelected].casa[equipo]);
        $scope.racha[ligaSelected].fueraFiltered[equipo] =          angular.copy($scope.racha[ligaSelected].fuera[equipo]);
        $scope.racha[ligaSelected].difPuntosCasaFiltered[equipo] =   angular.copy($scope.racha[ligaSelected].difPuntosCasa[equipo]);
        $scope.racha[ligaSelected].difPuntosFueraFiltered[equipo] =   angular.copy($scope.racha[ligaSelected].difPuntosFuera[equipo]);

        if (filterValue !== null){ // si selecciona null no filtramos y salimos

            var indextobedeleted = [];
            // get index to be deleted
            for ( var indexjornada in $scope.racha[ligaSelected].difPuntos[equipo] ) {
                var value = $scope.racha[ligaSelected].difPuntos[equipo][indexjornada];
                if (value > filterValue || value < -filterValue) {
                    indextobedeleted.push(indexjornada);
                }
            }
            //sort index in descent order
            indextobedeleted.sort( function(a,b){return b-a} );
            var cont=0;
            for (var i = indextobedeleted.length - 1; i >= 0; i -= 1) {

                $scope.racha[ligaSelected].calendarioFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].difGolFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].difPuntosFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].casaFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].fueraFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].difPuntosCasaFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].difPuntosFueraFiltered[equipo].splice(indextobedeleted[i]-cont, 1);

                cont++;
            }

        }





    };
    $scope.changedIgualdad = function() {
        var filterValue = $scope.igualdad[$scope.data.selectedindex2];

        $scope.racha[ligaSelected].calendarioFiltered =  angular.copy($scope.racha[ligaSelected].calendario) ;
        $scope.racha[ligaSelected].difGolFiltered =      angular.copy($scope.racha[ligaSelected].difGol);
        $scope.racha[ligaSelected].difPuntosFiltered =   angular.copy($scope.racha[ligaSelected].difPuntos);

        if (!filterValue){
            return 0;
        }

        // Filtro aplicado globalmente a todos los quipos
        for ( var equipo in $scope.racha[ligaSelected].difPuntos ){
                var indextobedeleted = [];
                // get index to be deleted
                for ( var indexjornada in $scope.racha[ligaSelected].difPuntos[equipo] ) {
                    var value = $scope.racha[ligaSelected].difPuntos[equipo][indexjornada];

                   if (value > filterValue || value < -filterValue) {
                        indextobedeleted.push(indexjornada);
                    }

                }
                //sort index in descent order

                indextobedeleted.sort( function(a,b){return b-a} );
                var cont=0;
                for (var i = indextobedeleted.length - 1; i >= 0; i -= 1) {
                    $scope.racha[ligaSelected].calendarioFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                    $scope.racha[ligaSelected].difGolFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                    $scope.racha[ligaSelected].difPuntosFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                    cont++;
                }
        }

    };


  /**
   * Definicicion dialogo CompareDialog
   */
  $ionicModal.fromTemplateUrl('templates/compareDialog.html', {
    scope: $scope,
    animation: 'slide-in-up',
      cerrar: function(){


          for ( var equipo in $scope.racha[$scope.items[$scope.data.selectedindex]].calendarioFiltered ){
              $scope.racha[$scope.items[$scope.data.selectedindex]].calendarioFiltered[equipo].checked = false;
          }
          $scope.selection=[];
          $scope.compareDialog.hide();
      }
  }).then(function(modal) {
    $scope.compareDialog = modal;
  });

    $scope.scoreClass = function(scores) {
        var clase= 'blanco';
        if (scores === 0) {
            clase= 'empate';
        } else if (scores >0) {
            clase= 'victoria';
        } else if (scores <0){
            clase= 'derrota';
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

      if ( $scope.racha[ligaSelected].donde[$scope.selection[0]][$scope.racha[ligaSelected].ultima]==='casa'  ){
          $scope.dificultadSelec0 =  $scope.racha[ligaSelected].difPuntos[$scope.selection[0]][$scope.racha[ligaSelected].ultima];
          $scope.dificultadSelec1 =  $scope.racha[ligaSelected].difPuntos[$scope.selection[1]][$scope.racha[ligaSelected].ultima];
      }else{
          $scope.dificultadSelec0 =  $scope.racha[ligaSelected].difPuntos[$scope.selection[1]][$scope.racha[ligaSelected].ultima];
          $scope.dificultadSelec1 =  $scope.racha[ligaSelected].difPuntos[$scope.selection[0]][$scope.racha[ligaSelected].ultima];
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

    if ($scope.selection.length ===2) {
          $scope.comparar();
    }
  };
    console.log( 'primera '+accessToken);

});
