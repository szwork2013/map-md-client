/**
 * Created by tiwen.wang on 6/2/2015.
 */
L.Control.LayersManager = L.Control.Layers.extend({
    _baseLayers: {},
    _overLayers: {},
    _baseLayer: null,
    _overLayer: {},
    initialize: function (options) {
        var self = this;
        //L.Control.Layers.initialize.call(this, options);
        self._layers = {};
        self._baseLayers = {};
        self._overLayers = {};
        self._baseLayer = null;
        self._overLayer = {};
    },
    onAdd: function(map) {
        var container = L.Control.Layers.prototype.onAdd.call(this, map);
        if(this._baseLayer) {
            map.addLayer(this._baseLayer);
        }
        angular.forEach(this._overLayer, function(overLayer, key) {
            map.addLayer(overLayer);
        });
        return container;
    },
    onRemove: function() {
        var self = this;
        if(this._baseLayer) {
            self._map.removeLayer(this._baseLayer);
        }
        angular.forEach(self._overLayer, function(overLayer, key) {
            self._map.addLayer(overLayer);
        });
    },
    setBaseLayer: function(mapCode, name) {
        if(!mapCode) {
            this._changeBaseLayer(null);
            return;
        }
        if(this._baseLayers[mapCode]) {
            this._changeBaseLayer(this._baseLayers[mapCode]);
        }else {
            var baseLayer = L.tileLayer.provider(mapCode);
            this._changeBaseLayer(baseLayer);
            this._baseLayers[mapCode] = baseLayer;
            this.addBaseLayer(baseLayer, name);
        }
    },
    setOverLayers: function(mapCodes) {
        var self = this;
        angular.forEach(this._overLayer, function(overLayer, key) {
            //if(!mapCodes[key]) {
            if(self._map) {
                self._map.removeLayer(overLayer);
            }
            self.removeLayer(overLayer);
            delete self._overLayer[key];
            //}
        });
        angular.forEach(mapCodes, function(mapCode, key) {
            if(!self._overLayer[key]) {
                if(self._overLayers[mapCode]) {
                    if(self._map) {
                        self._map.addLayer(self._overLayers[mapCode]);
                    }
                    self._overLayer[key] = self._overLayers[mapCode];
                }else {
                    var overLayer = L.tileLayer.provider(mapCode);
                    if(self._map) {
                        self._map.addLayer(overLayer);
                    }
                    self._overLayers[mapCode] = overLayer;
                    self._overLayer[key] = overLayer;
                    self.addOverlay(overLayer, key);
                }
            }
        });
    },
    _addOverLayer: function(overLayer) {
        var self = this;
        if(self._map) {
            self._map.addLayer(overLayer);
        }
    },
    _changeBaseLayer: function(baseLayer) {
        if(this._map) {
            if(this._baseLayer !== baseLayer) {
                if(this._baseLayer) {
                    this._map.removeLayer(this._baseLayer);
                }
                if(baseLayer) {
                    baseLayer.addTo(this._map);
                }
            }
        }
        this._baseLayer = baseLayer;
    },
    clear: function() {
        this.setBaseLayer(null);
        this.setOverLayers();
    }
});

L.control.layersManager = function( baseLayers, overLayers, options ) {
    var newControl = new L.Control.LayersManager( baseLayers, overLayers, options );
    return newControl;
};