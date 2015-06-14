/**
 * Created by tiwen.wang on 5/24/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.track.my', [])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.maps.track.my', {
                        url: '/my',
                        templateUrl: 'maps/track/my/my.tpl.html',
                        resolve: {},
                        controller: "MapsTrackMyCtrl as mtmc"
                    });
            }])
        .controller('MapsTrackMyCtrl',
        ['$scope', '$mdSidenav', '$log', '$q', 'Tracks', '$mmdMessage',
            MapsTrackMyCtrl]);

    var LOG_TAG = "Maps-Track-My: ";

    function MapsTrackMyCtrl($scope, $mdSidenav, $log, $q, Tracks, $mmdMessage) {

        var self = this;
        var page = 0, size = 20;

        Tracks.my(page, size).then(function(tracks) {
            self.tracks = tracks;
        });

        self.displayTrack = function(track) {
            if(track.layer) {
                $scope.activeTrack(track);
            }else {
                track.geoJson = JSON.parse(track.geo_json);
                $scope.addTrack(track, track.name);
            }
        };

        self.remove = function(track) {
            Tracks.remove(track.id).then(function() {
                $mmdMessage.success.remove();
                if(self.tracks.indexOf(track) > -1) {
                    self.tracks.splice(self.tracks.indexOf(track), 1);
                }
            },function(err) {
                $mmdMessage.fail.remove(err.statusText);
            });
        };

        self.edit = {
            editing: false,
            icon: 'content:remove_circle_outline',
            listener: function(e) {
                this.editing = !this.editing;
                this.icon = this.editing ? 'content:remove_circle' : 'content:remove_circle_outline';
            },
            label: '编辑'
        };
        self.toolbarActions = [];
        $scope.addToolbarAction = function(action) {
            self.toolbarActions.push(action);
        };
        $scope.removeToolbarAction = function() {
            self.toolbarActions = [];
        };

        $scope.addToolbarAction(self.edit);

        $scope.$on('$destroy', function(e) {
            self.toolbarActions = [];
        });
    }
})();