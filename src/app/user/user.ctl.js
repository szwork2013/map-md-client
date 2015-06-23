/**
 * Created by tiwen.wang on 6/23/2015.
 */
(function () {
    'use strict';

    angular.module('app.user', ['app.user.user', 'app.user.group'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.user', {
                        url: '/{name}',
                        templateUrl: 'user/user.tpl.html',
                        controller: 'UserCtrl as uc',
                        resolve: {
                            name: ['$stateParams', function($stateParams){
                                return $stateParams.name;
                            }]
                        }
                    })
                ;
            }])
        .controller('UserCtrl', ['$scope', '$log', 'Users', 'Groups', 'name', UserCtrl])
    ;

    function UserCtrl($scope, $log, Users, Groups, name) {
        var self = this;
        Groups.getByName(name).then(function(group) {
            if(group) {
                self.group = group;
                self.type = 'group';
            }else {
                Users.getByUsername(name).then(function(user) {
                    self.type = 'user';
                    self.user = user;
                });
            }
        });
    }
})();