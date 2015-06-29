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
        this.maps = {};
    },
    onAdd: function(map) {
        var container = L.Control.Layers.prototype.onAdd.call(this, map);

        for(var id in this.maps) {
            if(this.maps[id].map) {
                this.addMap(this.maps[id].map);
            }
        }
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
    _findActiveBaseLayer: function () {
        var layers = this._layers;
        for (var layerId in layers) {
            if (this._layers.hasOwnProperty(layerId)) {
                var layer = layers[layerId];
                if (!layer.overlay && this._map.hasLayer(layer.layer)) {
                    return layer;
                }
            }
        }
        throw new Error('Control doesn\'t have any active base layer!');
    },

    _findActiveOverlayLayers: function () {
        var result = {};
        var layers = this._layers;
        for (var layerId in layers) {
            if (this._layers.hasOwnProperty(layerId)) {
                var layer = layers[layerId];
                if (layer.overlay && this._map.hasLayer(layer.layer)) {
                    result[layerId] = layer;
                }
            }
        }
        return result;
    },
    _onLayerChange: function () {
        L.Control.Layers.prototype._onLayerChange.apply(this, arguments);
        this._recountLayers();
    },

    _onInputClick: function () {
        this._handlingClick = true;

        //this._recountLayers();
        L.Control.Layers.prototype._onInputClick.call(this);

        this._handlingClick = false;
    },

    _recountLayers: function () {
        var i, input, obj,
            inputs = this._form.getElementsByTagName('input'),
            inputsLen = inputs.length;

        for (i = 0; i < inputsLen; i++) {
            input = inputs[i];
            obj = this._layers[input.layerId];

            if (input.checked && !this._map.hasLayer(obj.layer)) {
                if (obj.overlay) {
                    this._activeOverlayLayers[input.layerId] = obj;
                } else {
                    this._activeBaseLayer = obj;
                }
            } else if (!input.checked && this._map.hasLayer(obj.layer)) {
                if (obj.overlay) {
                    delete this._activeOverlayLayers[input.layerId];
                }
            }
        }
    },
    addMap: function(map) {
        if(!this._map) {
            this.maps[map.id] = {
               map: map
            };
        }else {
            if(!this.maps[map.id]||!this.maps[map.id].baseLayer) {
                var baseLayer = L.tileLayer.provider(map.baseLayer);
                this.addBaseLayer(baseLayer, map.name);
                var overLayers = {};
                if(map.overLayers) {
                    for(var name in map.overLayers) {
                        var overLayer = L.tileLayer.provider(map.overLayers[name]);
                        //this.addOverlay(overLayer, name);
                        overLayers[name] = overLayer;
                    }
                }
                this.maps[map.id] = {
                    baseLayer: baseLayer,
                    overLayers: overLayers
                };
            }
            this.activeMap(this.maps[map.id]);
        }
    },
    activeMap: function(mapLayers) {
        var obj;
        // 添加overLayer到控制器
        for(var name in mapLayers.overLayers) {
            obj = this._layers[L.stamp(mapLayers.overLayers[name])];
            if(!obj) {
                this.addOverlay(mapLayers.overLayers[name], name);
            }
        }
        for(var id in this._layers) {
            obj = this._layers[id];
            if(obj.overlay) {
                if(mapLayers.overLayers[obj.name] && !this._map.hasLayer(obj.layer)) {
                    this._map.addLayer(obj.layer);
                }else if(!mapLayers.overLayers[obj.name]) {
                    if(this._map.hasLayer(obj.layer)) {
                        this._map.removeLayer(obj.layer);
                    }
                    this.removeLayer(obj.layer);
                }
            }else {
                if(mapLayers.baseLayer == obj.layer && !this._map.hasLayer(obj.layer)) {
                    this._map.addLayer(obj.layer);
                }else if(mapLayers.baseLayer != obj.layer && this._map.hasLayer(obj.layer)) {
                    this._map.removeLayer(obj.layer);
                }
            }
        }
    }
});

L.control.layersManager = function( baseLayers, overLayers, options ) {
    var newControl = new L.Control.LayersManager( baseLayers, overLayers, options );
    return newControl;
};