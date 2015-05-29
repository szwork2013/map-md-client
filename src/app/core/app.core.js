/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function() {
    'use strict';

    angular.module('app.core', ['app.core.theme', 'app.core.services', 'app.core.oauth'])
        //.value('staticCtx', 'http://static.photoshows.cn')
        .value('staticCtx', 'http://test.photoshows.cn')
        .factory('MainRestangular', ['Restangular', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                //RestangularConfigurer.setBaseUrl('http://www.photoshows.cn');
                RestangularConfigurer.setBaseUrl('http://localhost:8080');
            });
        }])
        .factory('ApiRestangular', ['Restangular', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                //RestangularConfigurer.setBaseUrl('http://www.photoshows.cn/api/rest');
                RestangularConfigurer.setBaseUrl('http://localhost:8080/api/rest');
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
})();