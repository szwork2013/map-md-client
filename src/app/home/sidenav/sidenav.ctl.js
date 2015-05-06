/**
 * Created by tiwen.wang on 4/23/2015.
 */
(function() {
    'use strict';

    angular.module('app.home', [])
        .controller('SidenavCtrl',
        ['$rootScope', '$scope', '$mdSidenav', '$mdDialog', '$log', '$q', 'Authenticated', 'Oauth2Service',
            SidenavCtrl]);

    function SidenavCtrl($rootScope, $scope, $mdSidenav, $mdDialog, $log, $q, Authenticated, Oauth2Service) {
        var self = this;

        $scope.Authenticated = Authenticated;

        $scope.linkItems = [
            { name: '地图', icon: 'maps:map', link: '#/maps' },
            { name: '图片', icon: 'image:photo_album', link: '#/photos' }
        ];

        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };

        $scope.signin = function(ev) {
            $mdDialog.show({
                controller: 'SigninCtrl',
                templateUrl: 'home/signin/signin.tpl.html',
                targetEvent: ev
            }).then(function(answer) {
                Authenticated.getUser();
            }, function() {
            });
        };

        $scope.$on('auth:loginRequired', function() {
            $log.debug("auth:login required -> token refresh");
            Oauth2Service.tokenRefresh().then(function() {
                // init logged user
                Authenticated.getUser();
            });
        });
    }

})();