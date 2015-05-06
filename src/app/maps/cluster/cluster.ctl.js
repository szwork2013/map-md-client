/**
 * Created by tiwen.wang on 4/30/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.cluster', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('maps.cluster', {
                        url: '/cluster',
                        views: {
                            '': {
                                templateUrl: 'maps/cluster/cluster.tpl.html',
                                controller: 'MapsClusterCtrl'
                            }
                        },
                        resolve: {}
                    });
            }])
        .controller('MapsClusterCtrl', ['$scope', '$log', 'leafletData', '$http', MapsClusterCtrl])
    ;

    function MapsClusterCtrl($scope, $log, leafletData, $http) {

        var addressPointsToMarkers = function(points) {
            return points.map(function(ap) {
                return {
                    layer: 'realworld',
                    lat: ap[0],
                    lng: ap[1]
                };
            });
        };

        var realworld = {
                name: "Real World markers",
                type: "markercluster",
                visible: false
            };

        leafletData.getMap('main-map').then(function(map) {

            $http.get("json/realworld.10.json").success(function(addressPoints) {
                var markers = L.markerClusterGroup({ chunkedLoading: true });
                for (var i = 0; i < addressPoints.length; i++) {
                    var a = addressPoints[i];
                    var title = a[2];
                    var marker = L.marker(L.latLng(a[0], a[1]), { title: title });
                    markers.addLayer(marker);
                }
                map.addLayer(markers);
                //$scope.setMarkers(addressPointsToMarkers(data));
                $scope.data = addressPoints;
            });
        });

    }
})();