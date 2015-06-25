/**
 * Created by tiwen.wang on 6/25/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .factory('$FeatureCollection', [function () {
            return {
                tranform: tranform
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
                    if(newFeature.properties.style) {
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
        }])
    ;


})();