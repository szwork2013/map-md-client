/**
 * Created by tiwen.wang on 5/23/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.track', [
        'app.maps.track.search',
        'app.maps.track.upload',
        'app.maps.track.my',
        'app.maps.track.display'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $urlRouterProvider
                    .when('/track', '/track/search')
                    .when('/track/', '/track/search');

                $stateProvider
                    .state('app.maps.track', {
                        abstract: true,
                        url: '^/track',
                        templateUrl: 'maps/track/track.tpl.html',
                        resolve: {},
                        controller: "MapsTrackCtrl"
                    });
            }])
        .controller('MapsTrackCtrl',
        ['$scope', '$mdSidenav', '$log', '$q',
            MapsTrackCtrl])
    ;

    var LOG_TAG = "Maps-Track: ";

    var Tracklayers;
    function MapsTrackCtrl( $scope, $mdSidenav, $log, $q) {
        var self = this;

        $scope.showTrackBottomSheet = function($event) {
            $scope.showGridBottomSheet($event, [
                { name: '上传', icon: 'maps:directions_walk', link: 'app.maps.track.upload' },
                { name: '我的', icon: 'social:person', link: 'app.maps.track.my' },
                { name: 'Help', icon: 'maps:heatmap' , link: 'app.helps.track'}
            ]).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        var tracklayers = new Tracklayers();

        $scope.getMap().then(function(map) {
            tracklayers.addTo(map);
        });

        $scope.addTrack = function(track, name) {
            tracklayers.addTrack(track, name);
        };

        $scope.activeTrack = function(track) {
            tracklayers.activeTrack(track);
        };

        $scope.removeTrack = function(track) {
            tracklayers.removeTrack(track);
        };

        $scope.$on('$destroy', function(e) {
            tracklayers.clear();
            $scope.getMap().then(function(map) {
                tracklayers.removeFrom(map);
            });
            $scope.closeRightSidenav();
        });

    }

    Tracklayers = L.Control.Layers.extend({
        _tracks: [],
        _stamp: (function () {
            var lastId = 0,
                key = '_track_id';
            return function (obj) {
                obj[key] = obj[key] || ++lastId;
                return obj[key];
            };
        }()),
        _activedTrack: null,
        addTrack: function(track, name) {
            var self = this;
            var id = self._stamp(track);
            if(!track.layer) {
                var elevation = L.control.elevation();
                track.elevation = elevation;
                track.layer = L.geoJson(track.geoJson, {
                    onEachFeature: elevation.addData.bind(elevation)
                });
            }
            track.layer.addTo(self._map);
            track.layer.on('click', function(e) {
                self.activeTrack(track);
            });
            self.addOverlay(track.layer, name);
            self.activeTrack(track);

            self._tracks.push(track);
        },
        activeTrack: function(track) {
            var self = this;
            if(self._activedTrack) {
                if(self._stamp(track) !== self._stamp(self._activedTrack)) {
                    self._map.removeControl(self._activedTrack.elevation);
                    track.elevation.addTo(self._map);
                    self._activedTrack = track;
                }
            }else {
                track.elevation.addTo(self._map);
                self._activedTrack = track;
            }
            self.fitBounds(track);
        },
        removeTrack: function(track) {
            var self = this;

            if(track.elevation && self._activedTrack) {
                if (self._stamp(track) === self._stamp(self._activedTrack)) {
                    self._map.removeControl(self._activedTrack.elevation);
                    self._activedTrack = null;
                }
            }

            if(track.layer) {
                self._map.removeLayer(track.layer);
                self.removeLayer(track.layer);
            }

            angular.forEach(self._tracks, function(t, key) {
                if (self._stamp(track) === self._stamp(t)) {
                    self._tracks.splice(key, 1);
                }
            });
        },
        fitBounds: function(track) {
            var bounds = track.layer.getBounds();
            if(bounds.isValid()) {
                this._map.fitBounds(bounds);
            }
        },
        clear: function() {
            var self = this;
            angular.forEach(self._tracks, function(track, key) {
                self.removeTrack(track);
            });
        }
    });

})();