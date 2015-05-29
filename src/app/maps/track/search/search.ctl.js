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

        $scope.setMapBarConfig({noToolbar: true});

        self.searchTextChange = function(text) {
            if(text) {
                Tracks.search(text).then(function(tracks) {
                    angular.forEach(tracks, function(track, key) {
                        self.tracks.push(track);
                    });
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
                self.addTrack(track);
            }
        };

        self.addTrack = function(track) {
            //var elevation = L.control.elevation();
            //track.elevation = elevation;
            //track.layer = L.geoJson(track.geoJson, {
            //    onEachFeature: elevation.addData.bind(elevation)
            //});
            $scope.addTrack(track, track.name);
        };

        self.querySearch = function(text) {
            var deferred = $q.defer();

            deferred.resolve([{
                name: 't1',
                id: 1
            },{
                name: 't2',
                id: 2
            },{
                name: 't3',
                id: 3
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
