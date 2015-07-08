/**
 * Created by tiwen.wang on 6/1/2015.
 */
(function() {
    'use strict';

    angular.module('app.home.signup', [])
        .controller('SignupCtrl',
        ['$scope', '$log', '$mdDialog', 'Signup', 'mdThemeColors', 'Authenticate',
            SignupController]);

    function SignupController($scope, $log, $mdDialog, Signup, mdThemeColors, Authenticate) {
        $scope.Authenticate = Authenticate;
        $scope.mdThemeColors = mdThemeColors;

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
            Signup.signup($scope.user).then(function(res) {
                var user = {
                    username: $scope.user.username,
                    password: $scope.user.password
                };
                $scope.answer(user);
            }, function(error) {
                $scope.loading  = false;
                $log.debug(error);
                if(error.status === 400) {
                    $scope.message = '用户名密码错误';
                }else if(error.status === 403) {
                    $scope.message = '用户名或邮箱已经存在';
                }else {
                    if(error.data) {
                        $scope.message = error.data.info;
                    }else {
                        $scope.message = error.statusText;
                    }
                }
            });

        };
    }
})();