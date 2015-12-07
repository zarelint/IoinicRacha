'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: detailRatesCtrl
 * @description
 * # detailRatesCtrl
 * Controller of the iotutorialApp
 */
app.controller('detailRatesCtrl', function ($stateParams, LigaService, $state, $scope, $ionicHistory) {

    $scope.algodesc = LigaService.getAlgo($stateParams.myParam);
    $scope.rate=$stateParams.myParam[2];


    function getRates (rates){

        var ratesParsed = [];
        var ratesCopy= []; //Avoid modify the original rates !!!
        angular.copy(rates,ratesCopy);
        var pleno = false;

        for (var index in rates ) {
            if (rates[index] !== null) {
                if (rates[index].indexOf('R') > -1) {
                    pleno = true;
                    ratesCopy[index] = rates[index].substring(1);
                } else {
                    pleno = false;
                }
                ratesParsed.push({rate: ratesCopy[index], pleno: pleno});
            }
        }
        return ratesParsed;
    }

    $scope.rates=getRates ($stateParams.myParam[0]);


    $scope.goBack = function() {
         $ionicHistory.goBack();
        //$state.go('tabs.tips');
    };
});
