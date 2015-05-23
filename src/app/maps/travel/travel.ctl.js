/**
 * Created by tiwen.wang on 5/6/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.travel', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.travel', {
                        url: '/travel/{id}',
                        views: {
                            '': {
                                templateUrl: 'maps/travel/travel.tpl.html',
                                controller: 'MapsTravelCtrl'
                            }
                        },
                        resolve: {
                            travelId: ['$stateParams', function($stateParams) {
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsTravelCtrl', ['$scope', '$log', '$filter', 'travelId', 'Travels', 'staticCtx',
            '$mmdPhotoDialog',
            MapsTravelCtrl])
    ;

    var LOG_TAG = "travel:";

    var TravelLayers;

    /**
     *
     * @param $scope
     * @param $log
     * @param $filter
     * @param travelId
     * @param Travels
     * @param staticCtx
     * @constructor
     */
    function MapsTravelCtrl($scope, $log, $filter, travelId, Travels, staticCtx,
                            $mmdPhotoDialog) {

        $log.debug(LOG_TAG + " travel id = " + travelId);

        $scope.staticCtx = staticCtx;

        getTravel(travelId);

        // sidebar config
        $scope.setMapBarConfig({noToolbar: true});

        var travelCLayers; // travel's control layers

        function getTravel(id) {
            Travels.get(id).then(function(travel) {
                $scope.travel = travel;
                setPaths(travel);
            });
        }

        function setPaths(travel) {

            $scope.getMap().then(function(map) {
                if(!travelCLayers) {
                    travelCLayers = new TravelLayers({}, {}, {collapsed: false}).addTo(map);
                    travelCLayers.staticCtx = staticCtx;
                }

                angular.forEach(travel.spots, function(spot, key) {
                    // 没有title则使用开始日期
                    if(!spot.title) {
                        if(spot.time_start) {
                            spot.title = $filter('date')(spot.time_start, "yyyy/MM/dd");
                        }else {
                            spot.title = spot.id;
                        }
                    }

                    // 照片按时间排序
                    spot.photos = spot.photos.sort(sortPhotos);

                    travelCLayers.addSpot(spot);
                });

                $scope.onSpotSelect(travel.spots[$scope.selectedIndex]);
            });
        }

        function sortPhotos(a, b) {
            return a.date_time - b.date_time;
        }

        $scope.onSpotSelect = function(spot) {
            travelCLayers.activeSpot(spot);
        };

        $scope.$on('$destroy', function(e) {

            $scope.getMap().then(function(map) {
                map.removeControl(travelCLayers);
            });
        });
    }

    TravelLayers = L.Control.Layers.extend({
        _polyline: {},
        addSpot: function(spot) {
            var self = this;
            var latlngs = [],
                markers = [],
                pathStyle = {
                color: '#008000',
                weight: 3
            };
            angular.forEach(spot.photos, function(photo, key) {
                latlngs.push(angular.copy(photo.point));
                markers.push(self._createMarker(photo).addTo(self._map));
            });
            var polyline = L.polyline(latlngs, pathStyle).addTo(self._map);
            self._polyline[spot.title] = polyline;
            var layer = L.layerGroup(markers)
                    .addLayer(polyline)
                    .addTo(self._map);
            self.addOverlay(layer, spot.title);
        },
        _createMarker: function(photo) {
            var self = this;
            var myIcon = L.divIcon({
                className: 'icon-marker',
                html: '<img src="' + self._getIconUrl(photo.oss_key) + '">'
            });
            var markerStyle = {icon: myIcon, riseOnHover: true};
            var marker = L.marker([photo.point.lat, photo.point.lng], markerStyle);
            marker.on('click', function(e) {
                self._map.fire('photoClick', {originEvent: e, photoId: photo.id});
            });
            return marker;
        },
        _getIconUrl : function(photoOssKey) {
            return this.staticCtx + "/" + photoOssKey + "@!panor-lg";
        },
        activeSpot: function(spot) {
            this._map.fitBounds(this._polyline[spot.title].getBounds());
        },
        onRemove: function(map) {
            var i;
            for (i in this._layers) {
               this._layers[i].layer.clearLayers();
               //this.removeLayer(this._layers[i]);
            }
        }
    });
})();
