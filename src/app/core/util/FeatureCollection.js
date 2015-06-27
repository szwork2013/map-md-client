/**
 * Created by tiwen.wang on 6/25/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .factory('$FeatureCollection', [function () {
            return {
                tranform: tranform,
                detransform: detransform
            };

            function tranform(featureCollection) {
                var features = [];
                for(var i in featureCollection.features) {
                    var feature = featureCollection.features[i];
                    var newFeature = {
                        type: feature.type,
                        properties: feature.properties||{},
                        geometry: feature.geometry
                    };
                    if(newFeature.properties.style && angular.isObject(newFeature.properties.style)) {
                        newFeature.properties.style = JSON.stringify(newFeature.properties.style);
                    }
                    if(feature.id) {
                        newFeature.id = feature.id;
                    }
                    features.push(newFeature);
                }
                var fc = {
                    type: featureCollection.type,
                    properties: angular.copy(featureCollection.properties)||{},
                    features: features
                };
                if(fc.properties.style) {
                    fc.properties.style = JSON.stringify(fc.properties.style);
                }
                return fc;
            }

            function detransform(featureCollection) {
                featureCollection = featureCollection || {
                        type: 'FeatureCollection',
                        properties: {style: {}},
                        features: []
                    };
                if(angular.isString(featureCollection.properties.style)) {
                    featureCollection.properties.style =
                        JSON.parse(featureCollection.properties.style);
                }
                angular.forEach(featureCollection.features, function(feature, key) {
                    if(feature.properties && feature.properties.style &&
                            angular.isString(feature.properties.style)) {
                        feature.properties.style = JSON.parse(feature.properties.style);
                    }
                });

                return featureCollection;
            }
        }])
    ;


})();