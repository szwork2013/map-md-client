/**
 * Created by tiwen.wang on 5/24/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.track.search', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.track.search', {
                        url: '/search',
                        templateUrl: 'maps/track/search/search.tpl.html',
                        resolve: {},
                        controller: "MapsTrackSearchCtrl as ctrl"
                    });
            }])
        .controller('MapsTrackSearchCtrl',
        ['$scope', '$mdSidenav', '$log', '$q', 'Tracks',
            MapsTrackSearchCtrl]);

    var LOG_TAG = "Maps-Track-Search: ";

    function MapsTrackSearchCtrl($scope, $mdSidenav, $log, $q, Tracks) {

        var self = this;
        var page = 0, size = 20;
        self.tracks = [];

        self.searchTextChange = function(text) {
            if(text) {
                Tracks.search(text, page, size).then(function(tracks) {
                    self.tracks = tracks;
                });
            }else {
                angular.forEach(self.tracks, function(track, key) {
                    $scope.removeTrack(track);
                });
                self.tracks = [];
            }
        };

        self.displayTrack = function(track) {
            if(track.layer) {
                $scope.activeTrack(track);
            }else {
                track.geoJson = JSON.parse(track.geo_json);
                self.addTrack(track);
            }
        };

        self.querySearch = function(text) {
            var deferred = $q.defer();

            deferred.resolve([{
                name: text,
                id: 1
            }]);

            return deferred.promise;
        };

        $scope.$on('$destroy', function(e) {
            angular.forEach(self.tracks, function(track, key) {
                $scope.removeTrack(track);
            });
            self.tracks = [];
        });
    }
})();
