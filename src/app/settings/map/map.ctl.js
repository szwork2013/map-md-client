/**
 * Created by tiwen.wang on 5/8/2015.
 */
(function () {
    'use strict';

    angular.module('app.settings.map', ['ui.router'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.settings.map', {
                        url: '/map',
                        templateUrl: 'settings/map/map.tpl.html',
                        controller: 'SettingsMapCtrl as smc',
                        resolve: {
                            //providers: ['Maps', function(Maps) {
                            //        return Authenticate.getUser();
                            //}]
                        }
                    })
                ;
            }])
        .controller('SettingsMapCtrl', ['$scope', '$log', '$mmdMessage',
            SettingsMapCtrl])
    ;

    var LOG_TAG = "[Settings maps]";

    function SettingsMapCtrl($scope, $log, $mmdMessage) {
        var self = this;
        self.settings = {};
        self.maps = [];

        $scope.formSubmit = function(maps) {
            $mmdMessage.fail.update("功能开发中");
        };

        $scope.$watch('smc.maps.length', function(length) {
            if(length && $scope.settingsForm) {
                $scope.settingsForm.$dirty = true;
            }
        });
    }
})();