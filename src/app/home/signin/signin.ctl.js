/**
 * Created by tiwen.wang on 4/28/2015.
 */
(function() {
    'use strict';

    angular.module('app.home.signin', [])
        .controller('SigninCtrl',
        ['$rootScope', '$scope', '$log', '$mdDialog', '$mmdUtil', 'Oauth2Service', 'Users', 'Authenticate',
            SigninController]);

    /**
     * 用户登录控制器
     * @param $rootScope
     * @param $scope
     * @param $log
     * @param $mdDialog
     * @param $mmdUtil
     * @param Oauth2Service
     * @param Users
     * @param Authenticate
     * @constructor
     */
    function SigninController($rootScope, $scope, $log, $mdDialog, $mmdUtil, Oauth2Service, Users, Authenticate) {
        $scope.Authenticate = Authenticate;
        $scope.user = {username: '', password: ''};

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.submit = function (user) {
            $scope.message = '';
            $scope.loading  = true;
            Oauth2Service.oauthUser(user).then(function(res) {
                $scope.loading  = false;
                Authenticate.getUser().then(function() {
                    $rootScope.$broadcast('auth:oauthed');
                });
                $scope.answer(res);
            }, function(error) {
                $scope.loading  = false;
                if(error.status == 400) {
                    $scope.message = '用户名密码错误';
                }else {
                    $scope.message = '网络错误';
                }
            });
        };

        $scope.signup = function(ev) {
            Authenticate.openSignup(ev).then(function(user) {
                $scope.submit(user);
            });
        };
    }
})();