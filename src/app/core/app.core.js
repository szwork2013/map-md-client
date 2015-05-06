/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function() {
    'use strict';

    angular.module('app.core', ['app.core.services', 'app.core.oauth'])
        .value('staticCtx', 'http://static.photoshows.cn')
        .factory('MainRestangular', ['Restangular', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl('http://www.photoshows.cn');
            });
        }])
    ;
})();