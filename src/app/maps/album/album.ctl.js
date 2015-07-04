/**
 * Created by tiwen.wang on 6/19/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.album', [
        'app.maps.album.fc',
        'app.maps.album.display'
    ])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.album', {
                        abstract: true,
                        url: '^/album',
                        templateUrl: 'maps/album/album.tpl.html',
                        controller: 'MapsAlbumCtrl as mac',
                        resolve: {}
                    });
            }])
        .controller('MapsAlbumCtrl', ['$scope', '$log', '$menuBottomSheet', '$timeout', MapsAlbumCtrl]);

    function MapsAlbumCtrl($scope, $log, $menuBottomSheet, $timeout) {

        var self = this;

        $scope.showBottomSheet = function($event) {
            $menuBottomSheet.show($event, [
                'app.albums.new',
                'app.user.my',
                'app.maps.upload',
                'app.helps.upload']);
        };

        $scope.setGeoJSON = function(geojson) {
            try {
                $scope.setGeojson({
                    data: geojson,
                    style: function (feature) {
                        return angular.extend({}, geojson.properties.style, feature.properties.style);
                    },
                    resetStyleOnMouseout: true,
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng);
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(buildPopup(feature.properties)[0]);
                        //layer.on({
                        //    mouseover: function(e) {
                        //    },
                        //    click: function(e) {
                        //    },
                        //    mouseout: function(e) {
                        //        //resetHighlight
                        //    }
                        //});
                    }
                });

            } catch (ex) {
                $log.debug(LOG_TAG + ex);
            } finally {
            }
        };

        function buildPopup(properties) {
            var html = angular.element('<table></table>');
            for(var name in properties) {
                if(name != "style") {
                    var row = angular.element('<tr></tr>');
                    var propName = angular.element('<td>'+name+':</td>');
                    var propValue = angular.element('<td>'+properties[name]+'</td>');
                    row.append(propName);
                    row.append(propValue);
                    html.append(row);
                }
            }
            return html;
        }

        $scope.$on('leafletDirectiveMap.geojsonCreated', function(e, geoJSON) {
            var bounds = geoJSON.getBounds();
            if(bounds.isValid()) {
                $scope.getMap().then(function(map) {
                    // 页面转向时fitBounds会不起作用，不知道原因，暂时先用延时
                    $timeout(function() {
                        map.fitBounds(bounds);
                    },1000);
                });
            }
        });

        $scope.$on('$destroy', function(e) {
        });
    }
})();