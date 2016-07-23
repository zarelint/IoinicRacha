'use strict';

app.controller('simpleRatesCtrl', function ($http, $stateParams,  $state, $scope, $ionicHistory) {

    function getRates (rates) {

        var ratesParsed = [];
        var day_output = [];
        var day_stake = [];
        
        var ganado_day =0;
        var gastado_day =0;
        var match_no=0;
        var acertados=0;
        var match_noG=0;
        var acertadosG=0;
        var week_index=0;


        for (var fecha in rates.betday) {
            week_index++;
            //Recorro numero de partidos apostados en la fecha
            for (var index_match in rates.betday[fecha].bets) {
                var match = rates.betday[fecha].bets[index_match];
                // acertados en la fecha
                match_no++;
                if (match.pleno===true) {
                    acertados++;
                }
                //global de acertados
                match_noG++;
                if (match.pleno===true) {
                    acertadosG++;
                }
            }

            // Get rate week
            if (match.pleno==='x'){
                var rate_week = null;
            }else{
                index_match++;
                var rate_week = acertados+'/'+ index_match;
                //stakes ---
                day_output[fecha] = rates.betday[fecha].resultado * 10;
                ganado_day = ganado_day + day_output[fecha];
                gastado_day = gastado_day + 10;
            }


            //---
            ratesParsed.push({stake:10, day_output:(day_output[fecha]/1 ).toFixed(1) ,jornada: week_index, rate: rate_week, pleno: index_match===acertados});
            // reset rate success
            match_no=0;
            acertados=0;

        }
        $scope.rate=(acertadosG/match_noG*100.00).toFixed(2);

        $scope.gastado = gastado_day.toFixed(2);
        $scope.ganado = ganado_day.toFixed(2);
        return ratesParsed;
    }



    $scope.rates=getRates ($stateParams.myParam);


    $scope.goBack = function() {
         $ionicHistory.goBack();
    };
});
