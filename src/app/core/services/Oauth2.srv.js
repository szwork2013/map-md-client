/**
 * Created by tiwen.wang on 4/29/2015.
 */
(function() {
    'use strict';

    var accessTokenName = "accessToken";

    angular.module('app.core.oauth', ['restangular'])
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('httpAuthInterceptor');
        }])
        .factory('Oauth2Service', ['$window', '$q', 'MainRestangular', '$mmdUtil', Oauth2Service])
        //.factory('authInterceptor', ['Oauth2Service', AuthInterceptor])
        .factory('httpAuthInterceptor', ['$window', '$rootScope', '$q', httpAuthInterceptor]);

    function Oauth2Service($window, $q, MainRestangular, $mmdUtil) {

        return {
            oauthUser: oauthUser,
            refreshToken: refreshToken,
            refresh: refresh,
            removeToken: removeToken,
            getStorageToken: getStorageToken
        };

        /**
         * 用户名登录oauth2授权
         * @param user {username: '用户名', password: '密码'}
         */
        function oauthUser(user) {
            var deferred = $q.defer();
            var oauth = {
                grant_type: 'password',
                client_id: 'my-trusted-client'
            };
            oauth = angular.extend(oauth, user);
            MainRestangular.one('oauth')
                .customPOST($mmdUtil.param(oauth),
                'token',
                {},
                {'Content-Type':  'application/x-www-form-urlencoded'} )
                .then(function(token) {
                    if (token.expires_in) {
                        var hours = Math.floor(token.expires_in / 60 / 60);
                        var currentDate = new Date();
                        currentDate.setHours(currentDate.getHours() + hours);
                        token.expires_time = currentDate;
                    }
                    $window.localStorage.setItem(accessTokenName, JSON.stringify(token));
                    deferred.resolve(token);
                }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function saveToken(token) {
            if (token.expires_in) {
                var hours = Math.floor(token.expires_in / 60 / 60);
                var currentDate = new Date();
                currentDate.setHours(currentDate.getHours() + hours);
                token.expires_time = currentDate;
            }
            $window.localStorage.setItem(accessTokenName, JSON.stringify(token));
        }

        /**
         *
         * @param token {refresh_token: ''}
         */
        function refreshToken(refresh_token) {
            var deferred = $q.defer();
            if(!refresh_token) {
                var token = JSON.parse($window.localStorage.getItem(accessTokenName));
                if(token && token.refresh_token) {
                    refresh_token = token.refresh_token;
                }
            }
            var oauth = {
                grant_type: 'refresh_token',
                client_id: 'my-trusted-client',
                refresh_token: refresh_token
            };
            MainRestangular.one('oauth')
                .customPOST($mmdUtil.param(oauth),
                'token',
                {},
                {'Content-Type':  'application/x-www-form-urlencoded'} )
                .then(function(token) {
                    saveToken(token);
                    deferred.resolve(token);
                }, function(error) {
                    deferred.reject(error);
                })
            ;
            return deferred.promise;
        }

        function refresh() {
            var deferred = $q.defer();
            var token = JSON.parse($window.localStorage.getItem(accessTokenName));
            if(token && token.access_token) {
                if(token.expires_time && Date.parse(token.expires_time) > new Date()) {
                    deferred.resolve(token.token_type + " " + token.access_token);
                }else {
                    return refreshToken(token.refresh_token);
                }
            }else {
                deferred.reject(token);
            }
            return deferred.promise;
        }

        function removeToken() {
            $window.localStorage.removeItem(accessTokenName);
        }

        function getStorageToken() {
            var token = JSON.parse($window.localStorage.getItem(accessTokenName));
            if(token) {
                return token.access_token;
            }
            return '';
        }
    }

    /**
     * http request reponse oauth Interceptor
     * @param $window
     * @param $rootScope
     * @param $q
     * @returns {{request: Function, response: Function}}
     */
    function httpAuthInterceptor($window, $rootScope, $q) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = JSON.parse($window.localStorage.getItem(accessTokenName));
                if (token && token.access_token && !config.url.match(/signin$/g) &&
                    !config.url.match(/signup$/g)) {
                    config.headers.Authorization = 'Bearer ' + token.access_token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (!rejection.config.ignoreAuthModule) {
                    switch (rejection.status) {
                        case 401:
                            var deferred = $q.defer();
                            $rootScope.$broadcast('auth:loginRequired', rejection);
                            return deferred.promise;
                        case 403:
                            $rootScope.$broadcast('auth:forbidden', rejection);
                            break;
                    }
                }
                // otherwise, default behaviour
                return $q.reject(rejection);
            }
        };
    }

})();