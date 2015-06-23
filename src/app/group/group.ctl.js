/**
 * Created by tiwen.wang on 6/18/2015.
 */
(function () {
    'use strict';

    angular.module('app.group', ['app.group.new', 'app.group.index'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $urlRouterProvider
                    .when('/group', '/group/new');

                $stateProvider
                    .state('app.group', {
                        abstract: true,
                        url: '/group',
                        templateUrl: 'group/group.tpl.html',
                        controller: 'GroupCtrl',
                        resolve: {}
                    })
                ;
            }])
        .controller('GroupCtrl', ['$scope', '$state', '$log', '$mdSidenav', '$mdToast', GroupCtrl])
    ;

    function GroupCtrl($scope, $state, $log, $mdSidenav, $mdToast) {
        var self = this;
    }
})();