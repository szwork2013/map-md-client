/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.popular',
        ['leaflet-directive', 'app.components', 'app.core', 'restangular', 'ui.router'])
        .config(['$logProvider', '$urlRouterProvider', '$stateProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.maps.popular', {
                        url: '/popular',
                        templateUrl: 'maps/popular/maps.popular.tpl.html',
                        resolve: {},
                        controller: "MapsPopularCtrl"
                    });
            }])
        .controller('MapsPopularCtrl',
        ['$scope', '$mmdPhotoDialog', '$log', '$q', 'leafletData', 'staticCtx', '$mmdUtil', 'Panoramios',
            MapsPopularCtrl])
        ;

    var LOG_TAG = "Maps-popular: ";

    /**
     *
     * @param $scope
     * @param $mmdPhotoDialog
     * @param $log
     * @param $q
     * @param leafletData
     * @param staticCtx
     * @param $mmdUtil
     * @param Panoramios
     * @constructor
     */
    function MapsPopularCtrl( $scope, $mmdPhotoDialog, $log, $q, leafletData, staticCtx, $mmdUtil, Panoramios) {
        var self = this;

        self.scope = $scope;
        self.scope.staticCtx = staticCtx;

        // sidebar config
        if($scope.setMapBarConfig) {
            $scope.setMapBarConfig({noToolbar: false, title: "浏览热门图片"});
        }

        leafletData.getMap('main-map').then(function(map) {

            var markerLayer =
                L.iconsLayer({
                    auto: true,
                    staticCtx: staticCtx
                }).setReadData(function(bounds, level, size) {
                    var deferred = $q.defer();
                    Panoramios.getList(
                        {
                            nelat: bounds.ne.lat,
                            nelng: bounds.ne.lng,
                            swlat: bounds.sw.lat,
                            swlng: bounds.sw.lng,
                            level: level,
                            width: size.width,
                            height: size.height,
                            vendor: 'gps'
                        })  // GET: /users
                        .then(function(photos) {
                            //$log.debug(res);
                            // returns a list of users
                            deferred.resolve(photos);
                        });
                    return deferred.promise;
                }).on('data_changed', onMapPhotosChanged)
                    .on('data_clicked', onMapPhotoClicked)
                    .addTo(map);

            //var circleMarkers =
            //    L.iconsLayer({
            //        auto: true
            //    }).setReadData(function(bounds, level, size) {
            //        var deferred = $q.defer();
            //        Panoramios.getList(
            //            {
            //                nelat: bounds.ne.lat,
            //                nelng: bounds.ne.lng,
            //                swlat: bounds.sw.lat,
            //                swlng: bounds.sw.lng,
            //                level: (level+1),
            //                width: size.width,
            //                height: size.height,
            //                vendor: 'gps'
            //            })  // GET: /users
            //            .then(function(photos) {
            //                //$log.debug(res);
            //                // returns a list of users
            //                deferred.resolve(photos);
            //            });
            //        return deferred.promise;
            //    }).on('data_changed', onMapPhotosChanged)
            //        .on('data_clicked', onMapPhotoClicked)
            //        .addTo(map);

            //circleMarkers.createMarker = function (photo) {
            //    var self = this;
            //
            //    var markerStyle = {
            //        radius: 4,
            //        fillColor: "#ff7800",
            //        color: "#ff7800",
            //        weight: 1,
            //        opacity: 0.2,
            //        fillOpacity: 0.8
            //    };
            //
            //    var marker = self._layers[photo.id];
            //    if (marker) {
            //        //self.addLayer(label);
            //    } else {
            //
            //        marker = L.circleMarker([photo.point.lat, photo.point.lng],
            //            markerStyle);
            //
            //        marker.photoId = photo.id;
            //        if (self._opts.clickable) {
            //            marker.on('click',
            //                function (e) {
            //                    if (self._opts.suppressInfoWindows) {
            //                        infoWindow.setLatLng(this.getLatLng())
            //                            .setContent(that.getInfoWindowContent(photo))
            //                            .openOn(map);
            //                    } else {
            //                        self.fire("data_clicked", {originEvent: e, photo: {id: this.photoId}});
            //                    }
            //                });
            //        }
            //        //map.entities.push(label);
            //        self._layers[photo.id] = marker;
            //
            //    }
            //    self.addLayer(marker);
            //};

            var overlays = {
                "Marker": markerLayer/*,
                "circleMarkers": circleMarkers*/
            };

            self.layers = L.control.layers({}, overlays).addTo(map);
            self.markerLayer = markerLayer;

            markerLayer.trigger();
            //self.circleMarkers = circleMarkers;
        });

        /**
         * set photos on map's panoramio photos changed
         * @param e {type: '', target: {}, photos: [photo]}
         */
        function onMapPhotosChanged(e) {
            $scope.photos = $mmdUtil.Array.mergeRightist($scope.photos || [], e.photos, "id");
            $log.debug(LOG_TAG + "photo wall changed");
            $scope.$broadcast('mmd-photo-wall-resize');
        }

        $scope.$on('mmd-photo-fluid-resized', function(e) {
            $log.debug(LOG_TAG + "photo wall resized");
        });

        function onMapPhotoClicked(ev) {
            $mmdPhotoDialog.show({target: ev.originEvent.target._icon}, ev.photo);
        }

        $scope.$on('$destroy', function(e) {
            leafletData.getMap('main-map').then(function(map) {
                map.removeLayer(self.markerLayer);
                //map.removeLayer(self.circleMarkers);
                map.removeControl(self.layers);
            });
            self.layers.removeLayer(self.markerLayer);
            //self.layers.removeLayer(self.circleMarkers);
        });
    }

})();