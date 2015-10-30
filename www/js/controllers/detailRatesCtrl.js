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
    $scope.rates=$stateParams.myParam[0];
    $scope.rangoJornadas=$stateParams.myParam[1][Object.keys($stateParams.myParam[1])[0]].rangoJornadas;
    $scope.rate=$stateParams.myParam[2];
    $scope.goBack = function() {
        // $ionicHistory.goBack();
        $state.go('tabs.tips');
    };
});
