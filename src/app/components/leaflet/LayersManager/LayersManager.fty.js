/**
 * Created by tiwen.wang on 6/29/2015.
 */
(function () {
    'use strict';

    /**
     * 图片图标的聚合控制器
     * @ngdoc module
     * @name app.components.leaflet.layersManager
     */
    angular.module('app.components.leaflet.layersManager', [])
        .factory('LayersManager', ['$mmdLeafletUtil', LayersManagerFactory]);

    function LayersManager(map) {
        this._map = map;
        this._layersManager = L.control.layersManager();
        this._layersManager.addTo(this._map);
    }

    LayersManager.prototype.addMap = function(map) {
        if(this._maps[map.id]) {

        }
    };

    function LayersManagerFactory($mmdLeafletUtil) {

    }
})();