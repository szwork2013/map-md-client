/**
 * Created by tiwen.wang on 4/21/2015.
 */
(function() {
    L.IconsLayer = L.LayerGroup.extend({

        initialize: function (options) {
            var self = this;
            self._opts = angular.extend({auto: true, clickable: true}, options);
            self._layers = {};
            self.markerId = [];
            self._listeners = {
                viewreset: function(e) {
                    self._onMapChanged(e);
                },
                moveend: function(e) {
                    self._onMapChanged(e);
                }
            };
        },
        _layers: {},
        _opts: {},
        onAdd: function (map) {
            var self = this;
            self._map = map;

            map.on(self._listeners);

            for(var i in self.markerId) {
                var id = self.markerId[i];
                if(self._layers[id]) {
                    map.addLayer(self._layers[id]);
                }
            }
        },

        onRemove: function (map) {
            var self = this;
            self._opts.auto = false;
            for (var i in self._layers) {
                map.removeLayer(self._layers[i]);
            }
            map.off(self._listeners);
        },

        _onMapChanged: function (e) {
            var self = this;

            //if (!self._opts.auto) {
            //    return;
            //}

            var bounds = self.getBounds(),
                level = self.getLevel(),
                size = self.getSize();

            // 地图为初始化完时 getBounds()为空
            if (!bounds.ne) {
                return;
            }

            self.fire('map_changed', [bounds, level, size]);

            var requestStamp = L.stamp(bounds);
            self._requestStamp = requestStamp;

            self.fire("loading");

            self._readData(bounds, level, size).then(function (data) {
                if (requestStamp != self._requestStamp) {
                    return;
                }
                self.fire("loaded");

                if (data.length > 0) {
                    var photoIds = [];
                    var photos = {};
                    $.each(data, function (index, photo) {
                        photoIds.push(photo.id);
                        photos[photo.id] = photo;
                    });
                    self._compareArray(
                        self.markerId,
                        photoIds,
                        function (a, c, b) {
                            if (a) {
                                self.hideLayer(a);
                                var index = self.markerId.indexOf(a);
                                if (index > -1) {
                                    self.markerId.splice(index, 1);
                                }
                            }

                            if (c) {
                                // do nothing
                            }

                            if (b) {
                                self.markerId.push(photos[b].id);
                                self.createMarker(photos[b]);
                            }
                        }
                    );
                    // trigger data_changed event
                    self.fire("data_changed", {photos: data});
                }
            });
        },
        createMarker: function (photo) {
            var self = this;
            var marker = self._layers[photo.id];
            if (marker) {
                //self.addLayer(label);
            } else {

                var myIcon = L.divIcon({
                    className: 'icon-marker',
                    html: '<img src="' + self.getIconUrl(photo.oss_key) + '">'
                });

                var markerStyle = {icon: myIcon, riseOnHover: true};
                markerStyle = angular.extend(markerStyle, self._opts.markerStyle);
                marker = L.marker([photo.point.lat, photo.point.lng],
                    markerStyle);

                marker.photoId = photo.id;
                if (self._opts.clickable) {
                    marker.on('click',
                        function (e) {
                            if (self._opts.suppressInfoWindows) {
                                infoWindow.setLatLng(this.getLatLng())
                                    .setContent(that.getInfoWindowContent(photo))
                                    .openOn(map);
                            } else {
                                self.fire("data_clicked", {originEvent: e, photo: {id: this.photoId}});
                            }
                        });
                }
                //map.entities.push(label);
                self._layers[photo.id] = marker;

            }
            self.addLayer(marker);
        },
        staticCtx: "http://static.photoshows.cn",
        getIconUrl : function(photoOssKey) {
            return this.staticCtx + "/" + photoOssKey + "@!panor-lg";
        },

        hideLayer: function (photoId) {
            var layer = this._layers[photoId];
            if (layer) {
                this.removeLayer(layer);
            }
        },
        _readData: function () {
            return {
                then: function () {

                }
            };
        },

        setReadData: function (readData) {
            this._readData = readData;
            return this;
        },
        getBounds: function () {
            var bounds = this._map.getBounds();
            if (bounds) {
                return {
                    ne: bounds.getNorthEast(),
                    sw: bounds.getSouthWest()
                };
            } else {
                return {};
            }
        },

        getLevel: function () {
            if(!!this._map) {
                var zoom = this._map.getZoom();
                return parseInt(zoom, 0);
            }else {
                return 0;
            }
        },

        getSize: function () {
            return {
                width: this._map.getSize().x,
                height: this._map.getSize().y
            };
        },

        _compareArray: function (arrayA, arrayB, callback) {
            if (arrayA && arrayB) {
                var newArray = $.unique($.merge($.merge([], arrayA), arrayB));
                $.each(newArray, function (index, value) {
                    if ($.inArray(value, arrayA) > -1) {
                        if ($.inArray(value, arrayB) > -1) {
                            callback.apply(value, [null, value, null]);
                        } else {
                            callback.apply(value, [value, null, null]);
                        }
                    } else {
                        if ($.inArray(value, arrayB) > -1) {
                            callback.apply(value, [null, null, value]);
                        }
                    }
                });
            }
        }
    });

    L.iconsLayer = function (options) {
        return new L.IconsLayer(options);
    };
})();

