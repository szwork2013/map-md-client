/**
 * Created by tiwen.wang on 5/22/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.heatmap.travel', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.heatmap.travel', {
                        url: '/travel/{id}',
                        templateUrl: 'maps/heatmap/travel/travel.tpl.html',
                        controller: 'MapsHeatmapTravelCtrl',
                        resolve: {
                            travelId: ['$stateParams', function ($stateParams) {
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsHeatmapTravelCtrl', ['$scope', '$log', 'travelId', 'Travels',
            MapsHeatmapTravelCtrl])
    ;

    var LOG_TAG = "Maps-Heatmap-Travel: ";

    function MapsHeatmapTravelCtrl($scope, $log, travelId, Travels) {

        getTravel(travelId);

        function getTravel(id) {
            Travels.get(id).then(function(travel) {
                $scope.travel = travel;
                setHeatMap(travel);
            });
        }

        function setHeatMap(travel) {
            var heatData = [];
            angular.forEach(travel.spots, function(spot, key) {
                angular.forEach(spot.photos, function(photo, key) {
                    if(photo.point) {
                        heatData.push([photo.point.lat, photo.point.lng]);
                    }
                });
            });
            $scope.setHeatMap("Travel " + travelId, heatData);
        }

        $scope.$on('$destroy', function(e) {
            $scope.removeHeatMap("Travel " + travelId);
        });
    }
})();