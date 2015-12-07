'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('LigasCtrl', function ( detailMatch, $state, myconf, $scope, $http,LigaService) {

    var ligaSelected;
    $http.get(myconf.url +'/listaligas').
        success(function(data) {
            $scope.ligas = data;
    });

    $scope.data = {};
    $scope.igualdad = [null,10,9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10];
    $scope.data.selectedindex = 1;
    $scope.data.selectedindex2 = 1;
    $scope.data.selectedindexEquipo0 = 1;
    $scope.data.selectedindexEquipo1 = 1;
    $scope.filtroAnimo={};
    //$scope.racha={};



    $scope.getkey = function (obj) {
        return Object.keys(obj)[0];
    };

    $scope.changedliga = function() {

        ligaSelected = $scope.data.selectedindex;
        $scope.ligaSelected = ligaSelected;

        LigaService.getliga(ligaSelected).then(function(data) {
            $scope.racha = data;
        });
        
        
        
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
/*                if (value > filterValue || value < -filterValue) {
                    indextobedeleted.push(indexjornada);
                }*/
                if (filterValue > 0){
                    if (value > filterValue || value <0) {
                        indextobedeleted.push(indexjornada);
                    }
                }
                if (filterValue < 0){
                    if (value < filterValue || value >0) {
                        indextobedeleted.push(indexjornada);
                    }
                }
                if (filterValue === 0){
                    if (value !== filterValue ) {
                        indextobedeleted.push(indexjornada);
                    }
                }
            }
            //sort index in descent order
            indextobedeleted.sort( function(a,b){return b-a} );
            var cont=0;
            for (var i = indextobedeleted.length - 1; i >= 0; i -= 1) {

                $scope.racha[ligaSelected].calendarioFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].difPuntosFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].casaFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].fueraFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].difPuntosCasaFiltered[equipo].splice(indextobedeleted[i]-cont, 1);
                $scope.racha[ligaSelected].difPuntosFueraFiltered[equipo].splice(indextobedeleted[i]-cont, 1);

                cont++;
            }

        }





    };




    $scope.scoreClass = function scoreClass(scores) {
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

    $scope.scoreClass2 = function scoreClass2(scores,dif,filtroAnimo) {
        var clase= 'blanco';
        if (scores === 0) {
            clase= 'empate';
        } else if (scores >0) {
            clase= 'victoria';
        } else if (scores <0){
            clase= 'derrota';
        }

        if (filtroAnimo.checked===true) {
            if (dif > 2 && scores === 0) { // has empatado con un mierda [bajonazo]
                clase = 'derrota';
            }
            if (dif < -2 && scores === 0) { // has empatado con el madrid [subidon y que se jodan]
                clase = 'victoria';
            }
            if (dif < -5 && scores < 0) { // has perdido con el madrid [ bueno chavles no pasa lo normas como si fuera un empate
                clase = 'empate';
            }
        }
        return clase;
    };


      

        $scope.comparar = function comparar() {
             
            
            for ( var equipo in $scope.racha[ligaSelected].calendarioFiltered ){
                  $scope.racha[ligaSelected].calendarioFiltered[equipo].checked = false;
            }
              
                 
             var ligaparsed= ligaSelected;
             var equipo1= $scope.selection[0];
             var equipo2= $scope.selection[1];
             detailMatch.jornada =  $scope.racha[ligaSelected].ultima;
             detailMatch.equipo1 = equipo1;
             detailMatch.equipo2 = equipo2;
             detailMatch.liga = ligaparsed;
             detailMatch.from = 'tabs.ligas';
             detailMatch.algodesc ='';
             $scope.selection=[];
             $state.go('detailMatch', {myParam: detailMatch});
  
         };


  $scope.selection=[];

  $scope.irPartido = function (match) {
      detailMatch.jornada =  $scope.racha[ligaSelected].ultima;
      detailMatch.equipo1 = match.split('-')[0];
      detailMatch.equipo2 = match.split('-')[1];
      detailMatch.liga = ligaSelected;
      detailMatch.from = 'tabs.ligas';
      detailMatch.algodesc ='';
      $scope.selection=[];
      $state.go('detailMatch', {myParam: detailMatch});
  };

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
    console.log( 'token: '+accessToken);

});
