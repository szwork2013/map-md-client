/**
 * Created by tiwen.wang on 5/14/2015.
 */
(function() {
    'use strict';

    angular.module('app.core.services')
        .run(['OSMWSRestangular', function(OSMWSRestangular) {
            //OSMWSRestangular.setDefaultRequestParams({key: "ZYZBZ-WCCHU-ETAVP-4UZUB-RGLDJ-QDF57"});
        }])
        .factory('OSMWS', ['$window', '$q', 'OSMWSRestangular', '$mmdUtil', OSMWSFactory])
    ;


    function OSMWSFactory($window, $q, OSMWSRestangular, $mmdUtil) {

        var osmSearch = OSMWSRestangular.one('search');
        return {
            geocoder: geocoder
        };

        function geocoder(address) {
            return osmSearch.get({q: address, format: 'json', polygon: 0, addressdetails: 1});
        }
    }
})();