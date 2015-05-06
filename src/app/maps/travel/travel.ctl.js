/**
 * Created by tiwen.wang on 5/6/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.travel', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('maps.travel', {
                        url: '/travel/{id}',
                        views: {
                            '': {
                                templateUrl: 'maps/travel/travel.tpl.html',
                                controller: 'MapsTravelCtrl'
                            }
                        },
                        resolve: {
                            travelId: ['$stateParams', function($stateParams) {
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsTravelCtrl', ['$scope', '$log', 'leafletData', 'travelId', 'Travels', 'staticCtx',
            MapsTravelCtrl])
    ;

    var LOG_TAG = "travel:";
    function MapsTravelCtrl($scope, $log, leafletData, travelId, Travels, staticCtx) {

        $log.debug(LOG_TAG + " travel id = " + travelId);

        $scope.staticCtx = staticCtx;

        getTravel(travelId);

        $scope.setMapBarConfig({noToolbar: true});

        function getTravel(id) {
            Travels.get(id).then(function(travel) {
                $scope.travel = travel;
                setPaths(travel);
            });
        }

        function setPaths(travel) {
            var paths = {};
            angular.forEach(travel.spots, function(spot, key) {
                var path = {
                    color: '#008000',
                    weight: 5,
                    latlngs: []
                };
                angular.forEach(spot.photos, function(photo, key) {
                    path.latlngs.push(angular.copy(photo.point));
                });

                paths[key] = path;
            });

            $scope.setPaths(paths);
        }
    }
})();
