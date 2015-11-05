'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: detailRatesCtrl
 * @description
 * # detailRatesCtrl
 * Controller of the iotutorialApp
 */
app.controller('detailRatesCtrl', function ($stateParams, LigaService, $state, $scope, $ionicHistory, $http,detailMatch) {
    //console.log($stateParams.myParam);

    $scope.algodesc = LigaService.getAlgo($stateParams.myParam);
    $scope.rate=$stateParams.myParam[2];


    //$scope.rates=$stateParams.myParam[0];

    function getRates (dd){
        var ratesParsed = [];
        var pleno = false;

        for (var index in dd ) {
            if (dd[index] !== null){
                if (dd[index].indexOf('R') > -1) {
                    pleno = true;
                    dd[index] = dd[index].substring(1);
                } else {
                    pleno = false;
                }
            }
            ratesParsed.push({rate: dd[index], pleno: pleno});
        }
        return ratesParsed;
    }
    $scope.rates=getRates ($stateParams.myParam[0]);


    $scope.goBack = function() {
         $ionicHistory.goBack();
        //$state.go('tabs.tips');
    };
});
