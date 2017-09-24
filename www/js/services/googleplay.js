app.factory('googlePlay', [
             '$window', '$http', '$log',  '$ionicLoading','$ionicPopup','myconf','$localStorage','$ionicHistory','$state','$q',
    function ($window,   $http,   $log,    $ionicLoading, $ionicPopup,  myconf,   $localStorage,  $ionicHistory,  $state, $q) {
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

            service.revocar = function revocar( ) {

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
                            delete $localStorage.google_access_token;
                            delete $localStorage.google_access_token_expire;
                            delete $localStorage.refresh_token;
                        }
                    );

                }
            };
            service.guardarCompra = function guardarCompra(googleReceipt) {
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
                            }else{
                                var alertPopup2 = $ionicPopup.alert({
                                    title: 'Thanks for your support',
                                    template: 'Ads removed. Enyoy it!<i class = "icon icon ion-android-happy"></i>'
                                });
                            }


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
            service.updateSubcription = function updateSubcription() {

                if (window.plugins != undefined) {
                    var validado=false;
                    var promises = [];
                    var subscrito=false;

                    inAppPurchase
                        .restorePurchases()
                        .then(function (purchases) {
                            function suscrito() {
                                $log.debug('Heyzap Eliminiado:');
                                HeyzapAds = false;
                                $localStorage.ngStorageVIP = true;
                            }
                            function noSuscripto() {
                                $log.debug('Heyzap Activado:');
                                HeyzapAds.start("518fc13d26fd390e114298a24e0291c0", new HeyzapAds.Options({disableAutomaticPrefetch: true})).then(function () {
                                    HeyzapAds.InterstitialAd.fetch();
                                    $log.debug('heyzap arrancado');
                                    // return HeyzapAds.showMediationTestSuite(); // returns a Promise
                                }, function (error) {
                                    $log.debug('Error Heyzap start' + error);
                                });
                                $localStorage.ngStorageVIP = false;
                            }

                            $http.get(myconf.url + '/getFecha/?access_token='+ $localStorage.google_access_token).then(function (data) {
                                $log.debug('subscrito:' + data.data.subscrito);
                                subscrito= data.data.subscrito;
                                $log.debug('ver compras usuario:'+JSON.stringify(purchases)+' '+purchases.length);
                                
                                if (purchases.length ==0 ){ // No compras en google
                                    // look manual subcription skrill
                                    if (subscrito){ 
                                        suscrito();
                                    }else{
                                        noSuscripto();
                                    }
                                }else{//Revisar todos los items comprados
                                    purchases.forEach(function(element) {
                                        // Build receipt
                                        var googleReceipt = {
                                            data: element.receipt,
                                            signature: element.signature
                                        };
                                        //validarlo en un Promise
                                        var prom = $http.post(myconf.url + '/validate', googleReceipt);
                                        promises.push(prom);
                                    });
                                    var request_num =0;
                                    // Resolver todos los promises
                                    $q.all(promises).then(function (res) {
                                        //Validar y guardar la factura de google en el perfil del usuario si fuera necesario
                                        //** rellanar validado
                                        
                                                // Get orderId factura guardada en el server
                                                $http.get(myconf.url + '/getFactura/?access_token='+ $localStorage.google_access_token).then(function (data) {
                                                    $log.debug('getFactura:' + data.data);
                                                    var ordersaved= data.data;
                                                    // por cada purchase          
                                                    res.some(function(element) {
                                                        $log.debug('sub valida:' + element.data.valida);
                                                        //Validar y guardarCompra si es necesario
                                                        if (element.data.valida) {
                                                            validado =true;
                                                            $log.debug('orderId:' + JSON.parse(purchases[request_num].receipt).orderId);
                                                            //He visto que a veces no se guarda la ultima subcription
                                                            // Esto lo detecta y actualiza a la ultima que se tenga comprada
                                                            if (ordersaved !== JSON.parse(purchases[request_num].receipt).orderId ||
                                                            // directamente no tenia gurarda ninguna
                                                                ordersaved == null
                                                            ){
                                                                service.guardarCompra(  {
                                                                    data: JSON.parse(purchases[request_num].receipt),
                                                                    signature: purchases[request_num].signature
                                                                });
                                                            }                                  
                                                            return true; //short-circuiting the execution of the rest.
                                                        }
                                                        request_num++;
                                                    });

                                                    // recorrido res hacer acciones
                                                    if (validado) {
                                                        suscrito();
                                                    } else {
                                                        noSuscripto();
                                                    }
                                                    
                                                });


                                    });
                                }

                            });

                        })
                        .catch(function (err) {
                          
                            $log.debug('google play plugin '+ err);
                            $ionicPopup.alert({
                                title: 'Something went wrong',
                                template: 'We can not connect with google play to check your subscription'
                            });
                            
                        });
                }

                return 0;
            };
            service.subcribirse = function subcribirse() {
                var spinner = '<ion-spinner icon="dots" class="spinner-stable"></ion-spinner><br/>';
                $ionicLoading.show({ template: spinner + 'Purchasing...' });


                $http.get(myconf.url+'/getSubcription').then(function(res) {
                    if (inAppPurchase  !== undefined  ){
                        inAppPurchase
                            .subscribe(res.data)
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

                });


    
    
                return 0;
            };


        return service;
    }
]);