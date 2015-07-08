/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function() {
    'use strict';

    angular.module('app.core', [
        'app',
        'app.core.theme',
        'app.core.services',
        'app.core.oauth',
        'app.core.filters',
        'LocalStorageModule'])
        .config(['localStorageServiceProvider', function(localStorageServiceProvider){
            localStorageServiceProvider.setPrefix('mdmap');
        }])
        .factory('MainRestangular', ['Restangular', 'serverBaseUrl',
            function(Restangular, serverBaseUrl) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(serverBaseUrl);
            });
        }])
        .factory('ApiRestangular', ['Restangular', 'serverBaseUrl',
            function(Restangular, serverBaseUrl) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(serverBaseUrl+'/api/rest');
            });
        }])
        .factory('QQWSRestangular', ['Restangular', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl('http://apis.map.qq.com/ws');
            });
        }])
        .factory('OSMWSRestangular', ['Restangular', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl('http://nominatim.openstreetmap.org');
            });
        }])
        .factory('LocalRestangular', ['Restangular', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl('json');
                RestangularConfigurer.setRequestSuffix('.json');
            });
        }])
    ;

    angular.module('app.core.filters', []);
})();