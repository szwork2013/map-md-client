/**
 * Created by tiwen.wang on 5/14/2015.
 */
(function() {
    'use strict';

    angular.module('app.core.services')
        .run(['QQWSRestangular', function(QQWSRestangular) {
            QQWSRestangular.setDefaultRequestParams({key: "ZYZBZ-WCCHU-ETAVP-4UZUB-RGLDJ-QDF57"});
        }])
        .factory('QQWebapi', ['$window', '$q', 'QQWSRestangular', '$mmdUtil', QQWebapiFactory])
    ;


    function QQWebapiFactory($window, $q, QQWSRestangular, $mmdUtil) {

        return {
            geocoder: geocoder,
            geodecoder: geodecoder,
            suggestion: suggestion
        };

        function geocoder(address) {
            return QQWSRestangular.one('geocoder', 'v1').get({address: address});
        }

        function geodecoder(location) {
            return QQWSRestangular.one('geocoder', 'v1').get({location: location, get_poi: 1});
        }

        function suggestion(keyword) {
            return QQWSRestangular.one('place', 'v1').one('suggestion').get({keyword: keyword});
        }
    }
})();