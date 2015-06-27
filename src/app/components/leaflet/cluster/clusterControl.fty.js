/**
 * Created by tiwen.wang on 6/27/2015.
 */
(function () {
    'use strict';

    /**
     * 图片图标的聚合控制器
     * @ngdoc module
     * @name app.components.leaflet.clusterControl
     */
    angular.module('app.components.leaflet.clusterControl', [])
        .factory('ClusterControl', ['$mmdLeafletUtil', ClusterControlFactory]);

    function ClusterControlFactory($mmdLeafletUtil) {

        var ClusterControl = function(map, photos, name) {
            this._map = map;
            this._photos = [];
            this._name = name;
            this._clusterControl = L.control.layers({},{});
            this._clusterControl.addTo(map);
            this._clusterGroup = L.markerClusterGroup();
            map.addLayer(this._clusterGroup);
            this._clusterControl.addOverlay(this._clusterGroup, name);
            this.addPhotos(photos);
        };

        ClusterControl.prototype.addPhotos = function(photo) {
            var self = this;
            if (angular.isArray(photo)) {
                angular.forEach(photo, function (photo, key) {
                    if(photo.location) {
                        self._clusterGroup.addLayer($mmdLeafletUtil.photoMarker(photo, self._map));
                        self._photos.push(photo);
                    }
                });
            } else if (angular.isObject(photo)) {
                if(photo.location) {
                    self._clusterGroup.addLayer($mmdLeafletUtil.photoMarker(photo, self._map));
                    self._photos.push(photo);
                }
            }
        };

        ClusterControl.prototype.size = function() {
            return this._photos.length;
        };

        ClusterControl.prototype.fitBounds = function() {
            this._map.fitBounds(this._clusterGroup.getBounds());
        };

        ClusterControl.prototype.clear = function() {
            this._clusterGroup.clearLayers();
        };

        ClusterControl.prototype.remove = function() {
            this.clear();
            this._map.removeLayer(this._clusterGroup);
            this._map.removeControl(this._clusterControl);
        };

        return ClusterControl;
    }
})();