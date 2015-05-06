/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.upload',
        ['ngMaterial', 'templates-app',
            'templates-common', 'restangular', 'ui.router'])
        .config(['$logProvider', '$urlRouterProvider', '$stateProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('maps.upload', {
                        url: '/upload',
                        templateUrl: 'maps/upload/maps.upload.tpl.html',
                        resolve: {},
                        controller: "MapsUploadCtrl"
                    });
            }])
        .controller('MapsUploadCtrl',
        ['$scope', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$log', '$q', 'Restangular',
            MapsUploadCtrl])
    ;
    function MapsUploadCtrl( $scope, $mdSidenav, $mdBottomSheet, $mdDialog, $log, $q, Restangular) {
        var self = this;
    }

})();