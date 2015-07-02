/**
 * Created by tiwen.wang on 7/2/2015.
 */
(function () {
    'use strict';

    angular.module('app.admin.maps', ['app.admin'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.admin.maps', {
                        url: '/maps',
                        templateUrl: 'admin/maps/maps.tpl.html',
                        controller: 'AdminMapsCtrl as amc',
                        resolve: {
                        }
                    })
                ;
            }])
        .controller('AdminMapsCtrl', ['$scope', '$log', '$mdDialog', 'Maps', '$mmdMessage', AdminMapsCtrl])
    ;

    function AdminMapsCtrl($scope, $log, $mdDialog, Maps, $mmdMessage) {
        var self = this;

        self.removeOverLayer = function(key) {
            delete self.map.overLayers[key];
        };

        self.overLayer = {};

        self.addOverLayer = function() {
            self.map.overLayers[self.overLayer.key] = self.overLayer.value;
            self.overLayer = {};
        };

        self.save = function(map) {
            if(map.id) {
                Maps.update({
                    id: map.id,
                    name: map.name,
                    baseLayer: map.baseLayer,
                    overLayers: map.overLayers
                }).then(function(map) {
                    $mmdMessage.success.update();
                },function(err) {
                    $mmdMessage.fail.update(err.statusText);
                });
            }else {
                Maps.create(map).then(function(map) {
                    $mmdMessage.success.create();
                },function(err) {
                    $mmdMessage.fail.create(err.statusText);
                });
            }

        };

        self.remove = function(map) {
            Maps.remove(map.id).then(function(map) {
                $mmdMessage.success.remove();
                delete self.map;
            },function(err) {
                $mmdMessage.fail.remove(err.statusText);
            });
        };

        self.cancel = function() {
            delete self.map;
        };
    }
})();