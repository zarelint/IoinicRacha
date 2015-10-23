'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('detailRatesCtrl', function (  $state, $scope, $ionicHistory, $http,detailMatch) {

    $scope.goBack = function() {
       // $ionicHistory.goBack();
        $state.go('tabs.tips');
    };


});
