/**
 * Created by tiwen.wang on 5/13/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .factory('$mmdLeafletUtil', ['staticCtx', function (staticCtx) {

            return {
                photoMarker: function(photo, map) {
                    var self = this;
                    var myIcon = L.divIcon({
                        className: 'icon-marker',
                        html: '<img src="' + self._getIconUrl(photo.oss_key) + '">'
                    });
                    var markerStyle = {icon: myIcon, riseOnHover: true};
                    var marker = L.marker(photo.point, markerStyle);
                    if(map) {
                        marker.on('click', function(e) {
                            map.fire('photoClick', {originEvent: e, photoId: photo.id});
                        });
                    }
                    return marker;
                },
                _getIconUrl: function(photoOssKey) {
                    return staticCtx + "/" + photoOssKey + "@!panor-lg";
                },
                providers: {
                    StamenWatercolor: {
                        name: "Stamen Watercolor",
                        code: 'Stamen.Watercolor'
                    },
                    AmapRoads: {
                        name: "高德公路",
                        code: 'AMap.Roads',
                        overlay: true
                    },
                    AmapSatellite: {
                        name: "高德卫星",
                        code: 'AMap.Satellite'
                    },
                    AmapBase: {
                        name: "高德",
                        code: 'AMap.Base'
                    },
                    CartoDBDarkMatterNoLabels: {
                        name: "CartoDB DarkMatterNoLabels",
                        code: "CartoDB.DarkMatterNoLabels"

                    },
                    NASAGIBSViirsEarthAtNight2012: {
                        name: "NASAGIBS ViirsEarthAtNight2012",
                        code: "NASAGIBS.ViirsEarthAtNight2012"
                    },
                    QQMap: {
                        name: "QQMap",
                        code: 'QQMap'
                    },
                    OpenTopoMap: {
                        name: "OpenTopoMap",
                        code: "OpenTopoMap"
                    },
                    "MapQuestOpenHybridOverlay": {
                        name: "MapQuestOpen HybridOverlay",
                        code: "MapQuestOpen.HybridOverlay",
                        overlay: true
                    },
                    EsriWorldImagery: {
                        name: "Esri WorldImagery",
                        code: "Esri.WorldImagery"
                    },
                    "MapBoxPenil": {
                        name: "MapBox Penil",
                        code: 'MapBox.Penil'
                    },
                    "MapBoxSatellite": {
                        name: "MapBox Satellite",
                        code: 'MapBox.Satellite'
                    },
                    "MapBoxSatelliteStreets": {
                        name: "MapBox SatelliteStreets",
                        code: 'MapBox.SatelliteStreets'
                    },
                    "MapBoxLight": {
                        name: "MapBox Light",
                        code: 'MapBox.Light'
                    },
                    "MapBoxDaithStar": {
                        name: "MapBox DaithStar",
                        code: 'MapBox.DaithStar'
                    },
                    "MarsSatellite": {
                        name: "MapBox MarsSatellite",
                        code: 'MapBox.MarsSatellite'
                    },
                    "AmericaTornado": {
                        name: "MapBox Tornado",
                        code: 'MapBox.Tornado',
                        overlay: true
                    }
                }
            };
        }])
    ;
})();