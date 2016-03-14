
/**
 * A service that handles methods related with Social authentication
 */
app.factory('SocialAuth', function($http, $q) {

    var SocialAuth = {};

    var authUser = null;

    var isGooglePlusAPIAvailableOrReject = function(deferred){
        if(window.plugins == null || window.plugins.googleplus == null){
            setTimeout(function(){
                console.log("API not available");
                deferred.reject("API not available");
            }, 100);

            return false;
        }

        return true;
    };


    /**
     * @brief Static method that returns the authenticated user object
     *
     */
    SocialAuth.getAuthUser = function() {
        return authUser;
    };

    /**
     * @brief Static method that check whether google+ is available or not,
     * returning a promise, with a unique parameter (true/false).
     *
     */
    SocialAuth.isGooglePlusAvailable = function() {
        var deferred = $q.defer();

        if(isGooglePlusAPIAvailableOrReject(deferred)){
            window.plugins.googleplus.isAvailable(
                function (available) {
                    deferred.resolve(available);
                }
            );
        }


        //return the promise object
        return deferred.promise;
    };


    /**
     * @brief Static method that attempts to log-in using Google+ auth API.
     * This method returns a promise with success/error callbacks.
     *
     * @returns obj The success callback gets a JSON object with the following contents g.e.
     *  obj.email        // 'eddyverbruggen@gmail.com'
     *  obj.userId       // user id
     *  obj.displayName  // 'Eddy Verbruggen'
     *  obj.gender       // 'male' (other options are 'female' and 'unknown'
     *  obj.imageUrl     // 'http://link-to-my-profilepic.google.com'
     *  obj.givenName    // 'Eddy'
     *  obj.middleName   // null (or undefined, depending on the platform)
     *  obj.familyName   // 'Verbruggen'
     *  obj.birthday     // '1977-04-22'
     *  obj.ageRangeMin  // 21 (or null or undefined or a different number)
     *  obj.ageRangeMax  // null (or undefined or a number)
     *  obj.idToken
     *  obj.oauthToken
     */
    SocialAuth.googlePlusLogin = function() {
        var deferred = $q.defer();

        if(isGooglePlusAPIAvailableOrReject(deferred)){
            window.plugins.googleplus.login(
                {
                    'offline': true//,
                    //'iOSApiKey': 'my_iOS_API_KEY_if_I_have_one',//,//,
                   //'scope' : 'https://www.googleapis.com/auth/userinfo.email',
                   // 'webApiKey': '321359984550-vh5udemt0d08osfq4krrn6nos846g6oa.apps.googleusercontent.com'
                    // there is no API key for Android; you app is wired to the Google+ API by listing
                    // your package name in the google dev console and signing your apk
                },
                function (obj) {
                    console.log(JSON.stringify(obj));
                    authUser = angular.fromJson(obj);
                    deferred.resolve(obj);
                },
                function (err) {
                    deferred.reject(err);
                }
            );
        }

        //get the promise object
        var promise = deferred.promise;

        //add success callback to the promise, and associate it with the RESOLVE call
        promise.success = function(fn) {
            return promise.then(function(response) {
                fn(response);
            })
        };

        //add success callback to the promise, and associate it with the REJECT call
        promise.error = function(fn) {
            return promise.then(null, function(response) {
                fn(response);
            })
        };

        //return the promise object
        return promise;
    };


    /**
     * @brief Static method that attempts to log-in silently using Google+ auth API.
     * This method returns a promise with success/error callbacks.
     * If it succeeds, you get the same object returned by googlePlusLogin. If it fails, it
     * will not show the auth dialog to the user
     *
     * @returns obj The success callback gets a JSON object like the one returned by
     * SocialAuth.googlePlusLogin
     *
     * @see SocialAuth.googlePlusLogin
     */
    SocialAuth.googlePlusSilentLogin = function() {
        var deferred = $q.defer();

        if(isGooglePlusAPIAvailableOrReject(deferred)){
            window.plugins.googleplus.trySilentLogin(
                {   'offline': true//,//, // optional and required for Android only - if set to true the plugin will also return the OAuth access token, that can be used to sign in to some third party services that don't accept a Cross-client identity token (ex. Firebase)
                    //'androidApiKey':'AIzaSyCOEsVfy-Ifpom2OnABLEjtVLDSejDk110'
                    //'scope' : 'https://www.googleapis.com/auth/userinfo.email'
                    //'webApiKey': 'AIzaSyCOEsVfy-Ifpom2OnABLEjtVLDSejDk110' //
                    //'iOSApiKey': 'my_iOS_API_KEY_if_I_have_one'
                },
                function (obj) {

                    console.log(JSON.stringify(obj));
                    authUser = angular.fromJson(obj);
                    deferred.resolve(obj);
                },
                function (err) {
                    console.log("error silent login"+err);
                    deferred.reject(err);
                }
            );
        }

        //get the promise object
        var promise = deferred.promise;

        //add success callback to the promise, and associate it with the RESOLVE call
        promise.success = function(fn) {
            return promise.then(function(response) {
                fn(response);
            })
        };

        //add success callback to the promise, and associate it with the REJECT call
        promise.error = function(fn) {
            return promise.then(null, function(response) {
                fn(response);
            })
        };

        //return the promise object
        return promise;
    };


    /**
     * @brief Static method that attempts to clear the OAuth2 token
     * returning a promise, with a unique message parameter
     *
     */
    SocialAuth.googlePlusLogout = function() {
        var deferred = $q.defer();

        if(isGooglePlusAPIAvailableOrReject(deferred)){
            window.plugins.googleplus.logout(
                function (msg) {
                    authUser = null;
                    deferred.resolve(msg);
                }
            );
        }

        //return the promise object
        return deferred.promise;
    };


    /**
     * @brief Static method that attempts to clear the OAuth2 token
     * and forget which account was used to log in (this forces the user to re-auth the app again)
     * returning a promise, with a unique message parameter
     *
     */
    SocialAuth.googlePlusDisconnect = function() {
        var deferred = $q.defer();

        if(isGooglePlusAPIAvailableOrReject(deferred)){
            window.plugins.googleplus.disconnect(
                function (msg) {
                    authUser = null;
                    deferred.resolve(msg);
                }
            );
        }

        //return the promise object
        return deferred.promise;
    };


    return SocialAuth;
});