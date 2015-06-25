/**
 * Created by tiwen.wang on 5/26/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.track.display', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.track.display', {
                        url: '/{id:[0-9]{1,30}}',
                        templateUrl: 'maps/track/track/track.tpl.html',
                        controller: "MapsTrackTrackCtrl as mttc",
                        resolve:{
                            trackId: ['$stateParams', function($stateParams){
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsTrackTrackCtrl',
        ['$scope', '$log', '$q', '$FeatureCollection', 'Tracks', 'trackId',
            MapsTrackTrackCtrl]);

    var LOG_TAG = "[Maps-Track-Display] ";

    function MapsTrackTrackCtrl($scope, $log, $q, $FeatureCollection, Tracks, trackId) {

        var self = this;

        self.trackId = trackId;

        Tracks.get(trackId).then(function(track) {
            track.geoJson = JSON.parse(track.geo_json);
            self.track = track;
            $scope.addTrack(track, track.name);
        });

        $scope.$on('$destroy', function(e) {
            $scope.removeTrack(self.track);
        });
    }
})();