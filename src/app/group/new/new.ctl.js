/**
 * Created by tiwen.wang on 6/18/2015.
 */
(function () {
    'use strict';

    angular.module('app.group.new', ['app.group'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.group.new', {
                        url: '/new',
                        templateUrl: 'group/new/new.tpl.html',
                        controller: 'GroupNewCtrl as gnc',
                        resolve: {}
                    })
                ;
            }])
        .controller('GroupNewCtrl', ['$scope', '$state', '$log', '$mmdMessage', 'Groups', GroupNewCtrl])
    ;

    function GroupNewCtrl($scope, $state, $log, $mmdMessage, Groups) {
        var self = this;
        self.step = 1;

        self.save = function(e) {
            Groups.create(self.group).then(function(group) {
                $mmdMessage.success.create();
                $scope.groupNewForm.$setPristine();
                self.step = 2;
            }, function(err) {
                $mmdMessage.fail.create(err);
            });

        };

        self.cancel = function(e) {

        };

    }
})();