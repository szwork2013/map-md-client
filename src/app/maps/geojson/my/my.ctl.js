/**
 * Created by tiwen.wang on 6/10/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.geojson.my', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.geojson.my', {
                        url: '/my',
                        templateUrl: 'maps/geojson/my/my.tpl.html',
                        controller: 'MapsGeojsonMyCtrl as mgmc'
                    });
            }])
        .controller('MapsGeojsonMyCtrl', ['$scope', '$log', '$q', 'GeoJSONs', '$mmdMessage',
            MapsGeojsonMyCtrl])
    ;

    var LOG_TAG = "Maps-Geojson-My: ";

    function MapsGeojsonMyCtrl($scope, $log, $q, GeoJSONs, $mmdMessage) {

        $scope.setTitle("我的GeoJSON");

        var self = this;
        var page = 0, size = 20;

        GeoJSONs.my(page, size).then(function(geoJSONs) {
            self.geoJSONs = geoJSONs;
        });

        self.remove = function(geoJSON) {
            GeoJSONs.remove(geoJSON.id).then(function() {
                var index = self.geoJSONs.indexOf(geoJSON);
                self.geoJSONs.splice(index, 1);
            });
        };

        self.edit = {
            editing: false,
            icon: 'content:remove_circle_outline',
            listener: function(e) {
                this.editing = !this.editing;
                this.icon = this.editing ? 'content:remove_circle' : 'content:remove_circle_outline';
            },
            label: '编辑'
        };
        $scope.addToolbarAction(self.edit);

        $scope.$on('$destroy', function(e) {
            //$scope.setGeoJSON({});
            $scope.removeToolbarAction();
        });
    }
})();