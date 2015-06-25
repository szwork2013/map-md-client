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
        .controller('UserCtrl', ['$scope', '$log', 'Users', 'name', 'Groups', '$mdDialog', 'Authenticate', UserCtrl])
    ;

    function UserCtrl($scope, $log, Users, name, Groups, $mdDialog, Authenticate) {
        var self = this;

        Users.getByUsername(name).then(function(user) {
            if(user.user) {
                self.type = 'group';
            }else {
                self.type = 'user';
            }
            self.user = user;
            self.title = user.name||user.username;
        });

        self.changeAvatar = function(ev) {
            $mdDialog.show({
                controller: 'AvatarUploadCtrl',
                templateUrl: 'home/avatar/avatar.tpl.html',
                targetEvent: ev
            }).then(function(image) {
                if(self.type == 'group') {
                    Groups.saveAvatar(self.user.id, image.id).then(function(user) {
                        self.user.avatar = user.avatar;
                    });
                }else {
                    Users.saveAvatar(self.user.id, image.id).then(function(user) {
                        self.user.avatar = user.avatar;
                    });
                }
            });
        };
    }
})();