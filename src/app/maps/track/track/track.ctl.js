/**
 * Created by tiwen.wang on 5/26/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.track.track', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.track.track', {
                        url: '/{id:int}',
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
        ['$scope', '$mdSidenav', '$log', '$q', 'Tracks', 'trackId',
            MapsTrackTrackCtrl]);

    var LOG_TAG = "Maps-Track-Track: ";

    function MapsTrackTrackCtrl($scope, $mdSidenav, $log, $q, Tracks, trackId) {

        var self = this;

        self.trackId = trackId;

        Tracks.get(trackId).then(function(track) {
            self.track = track;
            $scope.addTrack(track, track.name);
        });

        self.displayTrack = function(track) {
            if(track.layer) {
                $scope.activeTrack(track);
            }else {
                self.addTrack(track);
            }
        };

        $scope.$on('$destroy', function(e) {
            $scope.removeTrack(self.track);
        });
    }
})();