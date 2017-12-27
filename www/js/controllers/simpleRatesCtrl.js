'use strict';
/** @namespace rates.betday */
/** @namespace rates.betday.bets */
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

        var fechaKeys =  Object.keys(rates.betday);
        fechaKeys.sort(function (item1, item2) {
            var date1  =moment(item1, 'DD MM YYYY').toDate();
            var date2  =moment(item2, 'DD MM YYYY').toDate();

            if (date1 < date2)
                return -1;
            if (date1 > date2)
                return 1;
            return 0;
        });


        for (var i=0; i<fechaKeys.length;i++){
            //  for (var fecha in rates.betday) {
            var fecha = fechaKeys[i];
            week_index++;
            match_noG++;
            if ( rates.betday[fecha].resultado !== 0 ){
                acertadosG++;
            }
            var rate_week = null;
            // Get rate week
            if ( rates.betday[fecha].bets[0].pleno!=='x'){
                rate_week = acertados+'/'+ 5;
                var ayer = moment(fecha,'DD MM YYYY').subtract(1,'days').format('DD MM YYYY');
                var diaconPremio= true;
                var quaotaTotal = 1;
                for ( var match in rates.betday[fecha].bets){
                    if (!rates.betday[fecha].bets[match].pleno){
                        diaconPremio=false;
                        quaotaTotal =0.00;
                        break;
                    }else{
                        quaotaTotal = quaotaTotal* rates.betday[fecha].bets[match].odd
                    }
                }
                rates.betday[fecha].resultado=quaotaTotal.toFixed(2);

                //calculate stake
                if ( day_stake[ayer] !== undefined && rates.betday[ayer] !== undefined && quaotaTotal === 0 ){
                    day_stake[fecha]=parseFloat((day_stake[ayer] ).toFixed(0)) ;
                }else{
                    day_stake[fecha]=10;
                }

                //stakes ---moment(fecha,'DD MM YYYY').subtract(1,'days').format('DD MM YYYY');
                day_output[fecha] = quaotaTotal * day_stake[fecha];
                ganado_day = ganado_day + day_output[fecha];
                gastado_day = gastado_day + day_stake[fecha];
            }


            //---
            ratesParsed.push({stake:day_stake[fecha], odd:rates.betday[fecha].resultado,day_output:(day_output[fecha]/1 ).toFixed(2) ,jornada: week_index, rate: rate_week, pleno: parseInt(rates.betday[fecha].resultado) !==0});
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
