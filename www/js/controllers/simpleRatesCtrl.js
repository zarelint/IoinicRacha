'use strict';

app.controller('simpleRatesCtrl', function ($http, $stateParams,  $state, $scope, $ionicHistory) {

    function getRates (rates) {

        var ratesParsed = [];
        var day_output = [];
        var day_stake = [];
        var presupuesto = [];

        var ganado_day =0;
        var gastado_day =0;
        var match_no=0;
        var acertados=0;
        var match_noG=0;
        var acertadosG=0;
        var week_index=0;


        for (var fecha in rates.betday) {
            week_index++;
            match_noG++;
            if ( rates.betday[fecha].resultado !== 0 ){
                acertadosG++;
            }
            
            // Get rate week
            if ( rates.betday[fecha].bets[0].pleno==='x'){
                var rate_week = null;
            }else{
             
                var rate_week = acertados+'/'+ 5;

                var ayer = moment(fecha,'DD MM YYYY').subtract(1,'days').format('DD MM YYYY');
                //calculate stake
                if ( rates.betday[ayer] !== undefined && rates.betday[ayer].resultado == 0 ){
                    day_stake[fecha]=parseInt((day_stake[ayer] *2).toFixed(0)) ;
                }else{
                    day_stake[fecha]=10;
                }
                
                //stakes ---moment(fecha,'DD MM YYYY').subtract(1,'days').format('DD MM YYYY');
                day_output[fecha] = rates.betday[fecha].resultado * day_stake[fecha];
                ganado_day = ganado_day + day_output[fecha];
                gastado_day = gastado_day + day_stake[fecha];
            }


            //---
            ratesParsed.push({stake:day_stake[fecha], odd:rates.betday[fecha].resultado,day_output:(day_output[fecha]/1 ).toFixed(1) ,jornada: week_index, rate: rate_week, pleno: rates.betday[fecha].resultado!=0});
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
