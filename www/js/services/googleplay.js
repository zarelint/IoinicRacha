app.factory('googlePlay', [
    '$window', '$http', '$log',  '$ionicLoading','$ionicPopup','myconf','$localStorage','$ionicHistory','$state',
    function ($window,$http, $log,  $ionicLoading,$ionicPopup,myconf,$localStorage,$ionicHistory,$state) {
            // Initialize params
            var service = {};
            var data = {
                orderId: "GPA.1331-0370-6160-80574",
                packageName: "com.ionicframework.racha854942",
                productId: "freeads",
                purchaseTime: 1479146160663,
                purchaseState: 0,
                purchaseToken: "kkcclfgddofcfppajdggoiec.AO-J1OxTTXMI_ZCd-18Bgh9BIIFMeYkg1_xtHVuYmzv9ybDQk4FJKTgxIbg_40mD5SXyO94KEvJ_hgawkGuCXmDBnvqzTdiJTEHtDPRX8jzgA50DWkYuTyUONcdP4ToqgdQN4dk3AsE8",
                autoRenewing: true
            };
            var signature = 'IgvcYgWspE2LEtURDVYDZvXYaFBkZP2GN6Y1crnV5V3oSK44o/OoDyyC+AMfPrRLTfHnAi+qsExmi1+o+I8kDE6Lzxwbg/85NMFYCuAhHSulSH5JZ4rZog41akojYeEAa0HD6yqIO3b0cI1pkXDTBk5Nsi3kh/lydLyf4tDVzIO+/JCeyePwPzebSaYW74AFYxdL7Geij55pzhYJbHvwNOeQEbEIKb9Pb2fGt830GNTBI5S3lBt7GONyT0tOVPIgBRkG0UzDYGk2Wt+IDPTIlfsyUQIKgSG+Yj+b7yXPdGBfcvZBRyQOI8XYvysS1m0R+mptgfFO2sF+SsYFvPPdyg==';
            var googleReceipt = {
                data: data,
                signature: signature
            };

            service.revocar = function ( ) {

                // REVOCAR para recuperar forzar get refresh_token
                if ( !$localStorage['refresh_token'] && $localStorage['google_access_token']!== null  ) {
                    $log.debug('llamada a revocar...');


                    var http_revocar = $http({
                        url: 'https://accounts.google.com/o/oauth2/revoke',
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        params: {
                            token: $localStorage['google_access_token']
                        },
                        ignoreAuthModule: true

                    });
                    http_revocar.then(
                        function successCallback(data) {
                            // Por aqui no entra nunca por la respuesta es nula y no lo codifica como success
                            $log.debug('token revocado con exito' + data);
                            delete $localStorage.google_access_token;
                            delete $localStorage.google_access_token_expire;
                            delete $localStorage.refresh_token;
                        }, function errorCallback(response) {
                            // aunque funciona el revocado como data== null y entra por aqui
                            $log.debug('token revocado con exito'+JSON.stringify(response));
                            timeStorage.remove('google_access_token');
                            delete $localStorage.google_access_token;
                            delete $localStorage.google_access_token_expire;
                            delete $localStorage.refresh_token;
                        }
                    );

                }
            };
            service.guardarCompra = function (googleReceipt) {
                $log.debug('Factura que voy a enviar' + JSON.stringify(googleReceipt));
                $http.post(myconf.url + '/compra/?access_token='+ $localStorage.google_access_token, googleReceipt).then(function (data) {
                        $ionicLoading.hide();
                        if (data.data.resultado === 'OK'){
                            $localStorage.ngStorageVIP=true;
                            $ionicHistory.clearCache([$state.current.name]).then(function() {
                                $state.reload();
                            });
                             // En segundas instalaciones esto es necesario
                            if (!$localStorage.refresh_token ){
                               service.revocar();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Thanks for your support',
                                    template: 'Ads removed. <br>Login Again to update your profile.<br>Give permission this app to enable autologin'
                                });
                            }
                            var alertPopup = $ionicPopup.alert({
                                title: 'Thanks for your support',
                                template: 'Ads removed. Enyoy it!<i class = "icon icon ion-android-happy"></i>'
                            });

                        }
                    },
                    function(response){
                        $log.debug(response);
                        if (response.data.message !== 'Subcripcion caducada'){
                            window.open('mailto:'+social_config.email+'?&subject=Send us this email&body='+response.data.message, '_system');
                            var alertPopup = $ionicPopup.alert({
                                title: 'Contact with visualbetting@gmail.com',
                                template: 'Send us error to Support '
                            });
                        }

                    })
            };
            service.subcribirse = function () {
                var spinner = '<ion-spinner icon="dots" class="spinner-stable"></ion-spinner><br/>';
                $ionicLoading.show({ template: spinner + 'Purchasing...' });
                
                if (inAppPurchase  !== undefined  ){
                    inAppPurchase
                    .subscribe("removeads")
                        .then(function (data) {
                            $log.debug('consuming transactionId: ' + data.transactionId);
                            googleReceipt = {
                                data: data.receipt,
                                signature: data.signature
                            };
                            $log.debug('consume done! ... saving compra');
                            service.guardarCompra(googleReceipt);
                        })
                        .catch(function (err) {// error plugin compras
                            $ionicLoading.hide();
                   
  
                            if (err.response !==-1005 ){ // Operacion no cancelada por el propido usuario
                                $ionicPopup.alert({
                                    title: 'Something went wrong',
                                    template: 'Contact with support'
                                });

                                window.open('mailto:'+social_config.email+'?&subject=Send Us this email&body='+JSON.stringify(err), '_system');
                                $log.debug('googleplay.js 77:'+JSON.stringify(err));     
                            }

                        });
                }
                else{ // IE browser
                    service.guardarCompra(googleReceipt);
                }

    
    
                return 0;
            };


        return service;
    }
]);