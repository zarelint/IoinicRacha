'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller:LoaddataCtrl
 * @description
 * # LoaddataCtrl
 * Controller of the iotutorialApp
 */
app.controller('LoaddataCtrl', function (getResultados, $scope, getRacha) {

  //var updataData = function () {
    getResultados.loadData().then(function(data) {
      $scope.racha = getRacha.GetRachasCalendario(data[0]);

      $scope.scoreClass = function(scores) {
        var clase ='';
        if (scores === 0) {
          clase= 'empate';
        } else if (scores === 1) {
          clase= 'victoria';
        } else {
          clase= 'derrota';
        }
        return clase;
      };



      $scope.l2 =
      {
        'jesus': [1,2,3],  'jesus2': [1,2,3]
      };

      $scope.l =
      {
        'jesus': {
          'a': 1,
          'c': -1,
          'e': 0
        }
      };

      // Post.create(RachaCal);
    });

  //}

  // siguientes pasos...

  //pintarlos
  //


});
