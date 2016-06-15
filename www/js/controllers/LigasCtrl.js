'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('LigasCtrl', function ($localStorage, $log, detailMatch, $state, myconf, $scope, $http,LigaService) {

    var ligaSelected;

    LigaService.getListaLigas(false).then(function(items){
        $scope.ligas = items;
    });


    $scope.data = {};
    $scope.igualdad = [null,10,9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10];
    $scope.data.selectedindex = null;
    $scope.data.selectedindex2 = 1;
    $scope.data.selectedindexEquipo0 = 1;
    $scope.data.selectedindexEquipo1 = 1;
    $scope.filtroAnimo={};
    //$scope.racha={};



    $scope.getkey = function (obj) {
        return Object.keys(obj)[0];
    };
    function esPar(num) { return num % 2;}
    $scope.changedliga = function() {
        ligaSelected = $scope.data.selectedindex;
        $scope.ligaSelected = ligaSelected;



        //if(esPar($localStorage.mostrados) ) {
        if(window.localStorage.getItem(ligaSelected+'_visto')==null ) {
 
            if (HeyzapAds){
                HeyzapAds.InterstitialAd.show();
                HeyzapAds.InterstitialAd.fetch();
            }

            window.localStorage.setItem(ligaSelected+'_visto', true);
        }
       


        LigaService.getliga(ligaSelected).then(function(data) {
            $scope.racha = data;
        });
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
        $state.go('detailMatch_gol', {myParam: detailMatch});

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
      $state.go('detailMatch_gol', {myParam: detailMatch});
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


});
