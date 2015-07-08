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
                            user: ['$stateParams', 'Users', function($stateParams, Users){
                                return Users.getByUsername($stateParams.name);
                            }],
                            me:  ['Authenticate', '$q', function(Authenticate, $q) {
                                var deferred = $q.defer();
                                Authenticate.getUser().then(function(user) {
                                    deferred.resolve(user);
                                },function(err) {
                                    deferred.resolve({});
                                });
                                return deferred.promise;
                            }]
                        }
                    })
                ;
            }])
        .controller('UserCtrl', ['$scope', '$log', 'Users', 'user', 'me', 'Groups', '$mdDialog', 'UrlService', UserCtrl])
    ;

    function UserCtrl($scope, $log, Users, user, me, Groups, $mdDialog, UrlService) {
        var self = this;
        self.UrlService = UrlService;
        self.authority = {};

        if(user.user) {
            self.type = 'group';
            setEditable(user);
        }else {
            self.type = 'user';
            if(me.id == user.id) {
                self.authority.editable = true;
                self.authority.owned = true;
            }
        }
        self.user = user;
        self.title = user.name||user.username;

        /**
         * 设置登录用户是否可编辑
         */
        function setEditable(group) {
            self.authority.editable = false;
            self.authority.owned = false;
            angular.forEach(group.members, function(member, key) {
                if(member.id == me.id) {
                    self.authority.editable = true;
                }
            });
            if(me.id == group.id) {
                self.authority.owned = true;
            }
        }

    }
})();