'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: detailRatesCtrl
 * @description
 * # detailRatesCtrl
 * Controller of the iotutorialApp
 */
app.controller('detailMatchCtrl', function ( $ionicModal,$timeout, $ionicScrollDelegate, $stateParams, LigaService, $state, $scope, $ionicHistory, $http,detailMatch) {
    $scope.stateChanging = false;


    // Simulate a login delay. Remove this and replace with your login
    $timeout(function() {
        $scope.scrollDch('todos-scroll');
    }, 1000);


    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });

    $scope.ir = function(destino){
        $state.go(destino);
         //$state.go('tabs.tips');
    };
    $scope.abrev = function (name) {
        return name.substr(0,6)+'...';
    };
    $scope.scrollIzq = function(scroll_name) {
        var resto = 250-$ionicScrollDelegate.getScrollPosition().right;
        $ionicScrollDelegate.$getByHandle(scroll_name).scrollTo(resto, 0);
    };
    $scope.scrollDch = function(scroll_name) {
        var resto = 250-$ionicScrollDelegate.getScrollPosition().left;
        $ionicScrollDelegate.$getByHandle(scroll_name).scrollBy(resto, 0);
    };
    $scope.back = detailMatch.from;



    // inicializar controles
    $scope.data = {};
    $scope.igualdad = [null,10,9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10];
    $scope.data.selectedindex = 1;
    $scope.data.selectedindex2 = 1;
    $scope.data.selectedindexEquipo0 = 1;
    $scope.data.selectedindexEquipo1 = 1;
    $scope.filtroAnimo={};
    $scope.filtroHCP={};
    $scope.selection=[];


    //Selecionar Equipos
    $scope.selection[0] = detailMatch.equipo1;
    $scope.selection[1] = detailMatch.equipo2;
    $scope.algodesc= detailMatch.algodesc;
    var ligaSelected = detailMatch.liga;
    $scope.ligaSelected= ligaSelected;

// cortar el array de puntos porque esta relleno hasta el final.
    var corteJornadaEquipo  = function corteJornadaEquipo(equipo,jornada) {

        // Clear previous filters
        $scope.racha[ligaSelected].calendarioFiltered[equipo] =  angular.copy($scope.racha[ligaSelected].calendario[equipo]) ;
        $scope.racha[ligaSelected].difPuntosFiltered[equipo] =       angular.copy($scope.racha[ligaSelected].difPuntos[equipo]);
        $scope.racha[ligaSelected].casaFiltered[equipo] =           angular.copy($scope.racha[ligaSelected].casa[equipo]);
        $scope.racha[ligaSelected].fueraFiltered[equipo] =          angular.copy($scope.racha[ligaSelected].fuera[equipo]);
        $scope.racha[ligaSelected].difPuntosCasaFiltered[equipo] =   angular.copy($scope.racha[ligaSelected].difPuntosCasa[equipo]);
        $scope.racha[ligaSelected].difPuntosFueraFiltered[equipo] =   angular.copy($scope.racha[ligaSelected].difPuntosFuera[equipo]);



        var indextobedeleted = [];
        // get index to be deleted
        for (var indexjornada in $scope.racha[ligaSelected].difPuntos[equipo]) {
            if (indexjornada > jornada) {
                indextobedeleted.push(indexjornada);
            }
        }

        //sort index in descent order
        indextobedeleted.sort(function (a, b) {
            return b - a
        });

        var cont = 0;
        for (var i = indextobedeleted.length - 1; i >= 0; i -= 1) {

            $scope.racha[ligaSelected].calendarioFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            $scope.racha[ligaSelected].difPuntosFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            $scope.racha[ligaSelected].casaFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            $scope.racha[ligaSelected].fueraFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            $scope.racha[ligaSelected].difPuntosCasaFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            $scope.racha[ligaSelected].difPuntosFueraFiltered[equipo].splice(indextobedeleted[i] - cont, 1);

            cont++;
        }
    };
    var corteJornadaEquipoFiltradoFuera  = function corteJornadaEquipoFiltrado(equipo,jornada) {

        var indextobedeleted = [];
        // get index to be deleted
        for (var indexjornada in $scope.racha[ligaSelected].difPuntos[equipo]) {
            if (indexjornada > jornada) {
                indextobedeleted.push(indexjornada);
            }
        }

        //sort index in descent order
        indextobedeleted.sort(function (a, b) {
            return b - a
        });

        var cont = 0;
        for (var i = indextobedeleted.length - 1; i >= 0; i -= 1) {

            $scope.racha[ligaSelected].fueraFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            $scope.racha[ligaSelected].difPuntosFueraFiltered[equipo].splice(indextobedeleted[i] - cont, 1);

            cont++;
        }


    };
    var corteJornadaEquipoFiltradoCasa  = function corteJornadaEquipoFiltrado(equipo,jornada) {

        var indextobedeleted = [];
        // get index to be deleted
        for (var indexjornada in $scope.racha[ligaSelected].difPuntos[equipo]) {
            if (indexjornada > jornada) {
                indextobedeleted.push(indexjornada);
            }
        }

        //sort index in descent order
        indextobedeleted.sort(function (a, b) {
            return b - a
        });

        var cont = 0;
        for (var i = indextobedeleted.length - 1; i >= 0; i -= 1) {
            $scope.racha[ligaSelected].casaFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            $scope.racha[ligaSelected].difPuntosCasaFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            cont++;
        }


    };
    var corteJornadaEquipoFiltrado  = function corteJornadaEquipoFiltrado(equipo,jornada) {

        var indextobedeleted = [];
        // get index to be deleted
        for (var indexjornada in $scope.racha[ligaSelected].difPuntos[equipo]) {
            if (indexjornada > jornada) {
                indextobedeleted.push(indexjornada);
            }
        }

        //sort index in descent order
        indextobedeleted.sort(function (a, b) {
            return b - a
        });

        var cont = 0;
        for (var i = indextobedeleted.length - 1; i >= 0; i -= 1) {
            $scope.racha[ligaSelected].calendarioFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            $scope.racha[ligaSelected].difPuntosFiltered[equipo].splice(indextobedeleted[i] - cont, 1);
            cont++;
        }


    };



    // Cargar datos Liga si es que fuese necesario
    LigaService.getliga(ligaSelected).then(function(data) {

        $scope.racha =  data;
        //Como saber en la jornada que se enfrentaron para mostralo bien ?
       var jorMatch =  $scope.racha[ligaSelected].jornadabymatch[detailMatch.equipo1+'-'+detailMatch.equipo2];

        $scope.dificultadSelec0 =  $scope.racha[ligaSelected].difPuntos[$scope.selection[0]][jorMatch];
        $scope.dificultadSelec1 =  $scope.racha[ligaSelected].difPuntos[$scope.selection[1]][jorMatch];

        $scope.dificultadSelec0Casa =  $scope.racha[ligaSelected].difPuntosCasa[$scope.selection[0]][jorMatch];
        $scope.dificultadSelec1Fuera =  $scope.racha[ligaSelected].difPuntosFuera[$scope.selection[1]][jorMatch];

        // cortar el array de puntos porque esta relleno hasta el final.
        corteJornadaEquipo(detailMatch.equipo1,detailMatch.jornada);
        corteJornadaEquipo(detailMatch.equipo2,detailMatch.jornada);
        $scope.stateChanging = true;
    });


    $ionicModal.fromTemplateUrl('templates/detail/info.html', {
        scope: $scope,
        animation: 'slide-in-up',
        cerrar: function(){
            $scope.compareDialog.hide();
        }
    }).then(function(modal) {
        $scope.compareDialog = modal;
    });

    $scope.coloreacelda = function coloreacelda(valor,fromFilter) {

        if (fromFilter){
            return "texto-celda2";
        }

        if (valor ==='x'){
          return "texto-celda-black"
        }else{
          return "texto-celda2"
        }
    };
    $scope.filtrarHCP = function filtroHCP() {

        if ($scope.filtroHCP.checked){
            $scope.changedIgualdadEquipo($scope.selection[1],$scope.dificultadSelec1);
            $scope.changedIgualdadEquipo($scope.selection[0],$scope.dificultadSelec0);
            $scope.changedIgualdadEquipoCasaFuera($scope.selection[0],$scope.selection[1],$scope.dificultadSelec0Casa,$scope.dificultadSelec1Fuera);

            corteJornadaEquipoFiltrado(detailMatch.equipo2,detailMatch.jornada);
            corteJornadaEquipoFiltrado(detailMatch.equipo1,detailMatch.jornada);

            corteJornadaEquipoFiltradoFuera(detailMatch.equipo2,detailMatch.jornada);
            corteJornadaEquipoFiltradoCasa(detailMatch.equipo1,detailMatch.jornada);
            $scope.scrollDch('todos-scroll');
        }else{
            $scope.changedIgualdadEquipo($scope.selection[1],null);
            $scope.changedIgualdadEquipo($scope.selection[0],null);
            $scope.changedIgualdadEquipoCasaFuera($scope.selection[0],$scope.selection[1],null,null);

            // cortar el array de puntos porque esta relleno hasta el final.
            corteJornadaEquipo(detailMatch.equipo2,detailMatch.jornada);
            corteJornadaEquipo(detailMatch.equipo1,detailMatch.jornada);
            $scope.scrollDch('todos-scroll');

        }
    };
    $scope.goBack = function() {
         // $ionicHistory.backView().stateParams = {liga:detailMatch.liga};
          $ionicHistory.goBack();
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

    $scope.changedIgualdadEquipo = function changedIgualdadEquipo(equipo,filterValue) {
        // Clear previous filters
            $scope.racha[ligaSelected].calendarioFiltered[equipo] =      angular.copy($scope.racha[ligaSelected].calendario[equipo]) ;
            $scope.racha[ligaSelected].difPuntosFiltered[equipo] =       angular.copy($scope.racha[ligaSelected].difPuntos[equipo]);

        if (filterValue !== null){ // si selecciona null no filtramos y salimos

            var indextobedeleted = [];
            // get index to be deleted
            for ( var indexjornada in $scope.racha[ligaSelected].difPuntos[equipo] ) {
                var value = $scope.racha[ligaSelected].difPuntos[equipo][indexjornada];
                /*
                if (value > filterValue || value < -filterValue) {
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
                    $scope.racha[ligaSelected].calendarioFiltered[equipo][indextobedeleted[i]]=null;
                    $scope.racha[ligaSelected].difPuntosFiltered[equipo][indextobedeleted[i]]=null;

                cont++;
            }

        }



    };

    $scope.changedIgualdadEquipoCasaFuera = function changedIgualdadEquipoCASA(equipoCasa,equipoFuera,filterValueCasa,filterValueFuera) {

        //clear
        $scope.racha[ligaSelected].casaFiltered[equipoCasa] =            angular.copy($scope.racha[ligaSelected].casa[equipoCasa]);
        $scope.racha[ligaSelected].fueraFiltered[equipoFuera] =           angular.copy($scope.racha[ligaSelected].fuera[equipoFuera]);
        $scope.racha[ligaSelected].difPuntosCasaFiltered[equipoCasa] =   angular.copy($scope.racha[ligaSelected].difPuntosCasa[equipoCasa]);
        $scope.racha[ligaSelected].difPuntosFueraFiltered[equipoFuera] =  angular.copy($scope.racha[ligaSelected].difPuntosFuera[equipoFuera]);


        if (filterValueCasa !== null) { // si selecciona null no filtramos y salimos

            var indextobedeleted = [];
            // get index to be deleted
            for (var indexjornada in $scope.racha[ligaSelected].difPuntosCasa[equipoCasa]) {
                var value = $scope.racha[ligaSelected].difPuntosCasa[equipoCasa][indexjornada];
                /*
                 if (value > filterValue || value < -filterValue) {
                 indextobedeleted.push(indexjornada);
                 }*/
                if (filterValueCasa > 0) {
                    if (value > filterValueCasa || value < 0) {
                        indextobedeleted.push(indexjornada);
                    }
                }
                if (filterValueCasa < 0) {
                    if (value < filterValueCasa || value > 0) {
                        indextobedeleted.push(indexjornada);
                    }
                }
                if (filterValueCasa === 0) {
                    if (value !== filterValueCasa) {
                        indextobedeleted.push(indexjornada);
                    }
                }
            }
            //sort index in descent order
            indextobedeleted.sort(function (a, b) {
                return b - a
            });
            var cont = 0;
            for (var i = indextobedeleted.length - 1; i >= 0; i -= 1) {
                $scope.racha[ligaSelected].casaFiltered[equipoCasa][indextobedeleted[i]]=null;
                $scope.racha[ligaSelected].difPuntosCasaFiltered[equipoCasa][indextobedeleted[i]]=null;
                cont++;
            }
        }

        if (filterValueFuera !== null){
            indextobedeleted = [];
            // get index to be deleted
            for (  indexjornada in $scope.racha[ligaSelected].difPuntosFuera[equipoFuera] ) {
                value = $scope.racha[ligaSelected].difPuntosFuera[equipoFuera][indexjornada];

                if (filterValueFuera > 0){
                    if (value > filterValueFuera || value <0) {
                        indextobedeleted.push(indexjornada);
                    }
                }
                if (filterValueFuera < 0){
                    if (value < filterValueFuera || value >0) {
                        indextobedeleted.push(indexjornada);
                    }
                }
                if (filterValueFuera === 0){
                    if (value !== filterValueFuera ) {
                        indextobedeleted.push(indexjornada);
                    }
                }
            }
            //sort index in descent order
            indextobedeleted.sort( function(a,b){return b-a} );
            cont=0;
            for ( i = indextobedeleted.length - 1; i >= 0; i -= 1) {
                //$scope.racha[ligaSelected].fueraFiltered[equipoFuera].splice(indextobedeleted[i]-cont, 1);
                //$scope.racha[ligaSelected].difPuntosFueraFiltered[equipoFuera].splice(indextobedeleted[i]-cont, 1);

                $scope.racha[ligaSelected].fueraFiltered[equipoFuera][indextobedeleted[i]]=null;
                $scope.racha[ligaSelected].difPuntosFueraFiltered[equipoFuera][indextobedeleted[i]]=null;
                cont++;
            }
        }





    };




});
