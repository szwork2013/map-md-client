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
        ['$scope', '$mdSidenav', '$log', '$q', 'Tracks',
            MapsTrackMyCtrl]);

    var LOG_TAG = "Maps-Track-My: ";

    function MapsTrackMyCtrl($scope, $mdSidenav, $log, $q, Tracks) {

        var self = this;

        self.displayTrack = function(track) {
            if(track.layer) {
                $scope.activeTrack(track);
            }else {
                self.addTrack(track);
            }
        };
    }
})();