/**
 * Created by tiwen.wang on 6/5/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.geojson.search', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.geojson.search', {
                        url: '/search',
                        templateUrl: 'maps/geojson/search/search.tpl.html',
                        controller: 'MapsGeojsonSearchCtrl as mgsc'
                    });
            }])
        .controller('MapsGeojsonSearchCtrl', ['$scope', '$log', '$timeout', '$q', 'GeoJSONs',
            '$mmdMessage',
            MapsGeojsonSearchCtrl])
    ;

    var LOG_TAG = "Maps-Geojson-Search: ";

    function MapsGeojsonSearchCtrl($scope, $log, $timeout, $q, GeoJSONs, $mmdMessage) {
        var self = this;

        $scope.setTitle("搜索");
        var page = 0, size = 20;

        self.querySearch = function(text) {
            return GeoJSONs.search(text, page, size);
        };

        self.searchTextChange = function(text) {
            $log.debug(LOG_TAG + "searchTextChanged " + text);
            if(text) {
                //search(text);
            }
        };

        self.selectedItemChange = function(item) {
            $log.debug(LOG_TAG + "selectedItemChange");
            $log.debug(item);
            if(item&&item.name) {
                search(item.name);
            }
        };

        function search(query) {
            GeoJSONs.search(query, page, size).then(function(geoJSONList) {
                self.geoJSONs = geoJSONList;
            });
        }

        self.geoJSON = {};
        self.display = function(geoJSON) {
            if(angular.isString(geoJSON.data) ) {
                geoJSON.data = JSON.parse(geoJSON.data);
                if(geoJSON.data.properties &&
                    geoJSON.data.properties.style) {
                    geoJSON.style = geoJSON.data.properties.style;
                }
            }
            if(self.geoJSON !== geoJSON) {
                $scope.setGeoJSON(geoJSON);
                self.geoJSON = geoJSON;
            }
        };

        $scope.$on('$destroy', function(e) {
            $scope.setGeoJSON({});
        });
    }

})();