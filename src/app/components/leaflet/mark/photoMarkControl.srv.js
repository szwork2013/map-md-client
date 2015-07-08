/**
 * Created by tiwen.wang on 7/5/2015.
 */
(function () {
    'use strict';

    var PhotoMarkableControl = L.Control.Layers.extend({
        options: {
            position: 'topright',
            draw: {},
            edit: false
        },
        _marking: false,
        _marker: null,
        _markFile: null,
        initialize: function (options) {
            L.Control.Layers.prototype.initialize.call(this, options);
            this._marker = L.marker(L.latLng(0, 0));
            this._layerGroup = L.layerGroup([]);
        },
        _deferred: null,
        marking: function (file) {
            var deferred = $q.defer();
            this._markFile = file;
            if (!this._marking) {
                this._marking = true;
                this._marker.addTo(this._map);
            }
            this._deferred = deferred;
            return this._deferred.promise;
        },
        removeMarker: function (file) {
            var self = this;
            if (file.marker && this._map.hasLayer(file.marker)) {
                this._map.removeLayer(file.marker);
                self._layerGroup.removeLayer(file.marker);
                delete file.marker;
            }
            return file;
        },
        addMarker: function(file) {
            if(!file.marker) {
                this.createMarker(file, L.latLng(file.position[1], file.position[0]));
            }
        },
        cancel: function () {
            var self = this;
            if (self._marking) {
                self._marker.setLatLng(L.latLng(0, 0));
                self._map.removeLayer(self._marker);
            }
            self._marking = false;
            self._deferred = null;
        },
        onAdd: function (map) {
            var self = this;
            var container = L.Control.Layers.prototype.onAdd.call(this, map);
            map.on('mousemove', function (e) {
                if (self._marking) {
                    self._marker.setLatLng(e.latlng);
                }
            });
            map.on('click', function (e) {
                if (self._marking) {
                    var marker = self.createMarker(self._markFile, e.latlng);
                    self._deferred.resolve(marker);
                    self.cancel();
                }
            });
            self._layerGroup.addTo(map);
            self.addOverlay(self._layerGroup, "图片位置标注");
            return container;
        },
        onRemove: function () {
            var self = this;
            self._layerGroup.clearLayers();
        },
        createMarker: function (file, latlng) {
            var self = this;
            var marker = L.marker(latlng, {
                draggable: true
            });
            marker.addTo(self._map);
            self._layerGroup.addLayer(marker);
            marker.on('dragend', function (e) {
                //$scope.setLocation(file, e.target.getLatLng());
            });
            file.marker = marker;
            //$scope.setLocation(file, latlng);
            return marker;
        }
    });

    /**
     * 图片标记位置的控制器
     * @ngdoc module
     * @name app.components.leaflet.photoMarkControl
     */
    angular.module('app.components.leaflet.photoMarkControl', [])
        .factory('PhotoMarkControl', ['$mmdLeafletUtil', PhotoMarkableControl]);

})();