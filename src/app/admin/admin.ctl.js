/**
 * Created by tiwen.wang on 7/2/2015.
 */
(function () {
    'use strict';

    angular.module('app.admin', ['app.admin.maps'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.admin', {
                        abstract: true,
                        url: '/admin',
                        templateUrl: 'admin/admin.tpl.html',
                        controller: 'AdminCtrl as ac',
                        resolve: {
                        }
                    })
                ;
            }])
        .controller('AdminCtrl', ['$scope', '$log', '$mdDialog', 'Authenticate', AdminCtrl])
    ;

    function AdminCtrl($scope, $log, $mdDialog, Authenticate) {
        var self = this;

    }
})();