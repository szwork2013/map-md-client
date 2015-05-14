/**
 * Created by tiwen.wang on 4/28/2015.
 */
(function() {
    'use strict';

    angular.module('app.home')
        .controller('SigninCtrl',
        ['$scope', '$log', '$mdDialog', '$mmdUtil', 'Oauth2Service', 'Users', 'Authenticated',
            SigninController]);

    /**
     * 用户登录控制器
     * @param $scope
     * @param $log
     * @param $mdDialog
     * @param $mmdUtil
     * @param Oauth2Service
     * @param Users
     * @param Authenticated
     * @constructor
     */
    function SigninController($scope, $log, $mdDialog, $mmdUtil, Oauth2Service, Users, Authenticated) {
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

        $scope.submit = function () {
            $scope.message = '';
            $scope.loading  = true;
            Oauth2Service.oauthUser($scope.user).then(function(res) {
                $scope.loading  = false;
                $scope.answer(res);
            }, function(error) {
                $scope.loading  = false;
                if(error.status == 400) {
                    $scope.message = '用户名密码错误';
                }
            });

        };
    }
})();