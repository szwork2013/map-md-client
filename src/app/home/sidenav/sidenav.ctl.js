/**
 * Created by tiwen.wang on 4/23/2015.
 */
(function () {
    'use strict';

    angular.module('app.home', [])
        .controller('SidenavCtrl',
        ['$rootScope', '$scope', '$mdSidenav', '$mdDialog', '$log', '$q', 'Authenticated',
            'Oauth2Service', '$state', SidenavCtrl]);

    function SidenavCtrl($rootScope, $scope, $mdSidenav, $mdDialog, $log, $q, Authenticated,
                         Oauth2Service, $state) {
        var self = this;

        $scope.Authenticated = Authenticated;

        $scope.linkItems = [
            {name: '热门图片', icon: 'maps:map', state: 'app.maps.popular'},
            {name: 'Track', icon: 'maps:directions_walk', state: 'app.maps.track.search'},
            {name: 'Colorth Map', icon: 'image:photo_album', state: 'app.photos'},
            {name: '图片', icon: 'image:photo_album', state: 'app.photos'},
            {name: '设置', icon: 'action:settings_applications', state: 'app.settings.account'}
        ];

        $scope.close = self.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };

        $scope.navigateTo = function(state, event) {
            $state.go(state).then(function() {
                self.close();
            });
        };

        $scope.signin = function (ev) {
            $mdDialog.show({
                controller: 'SigninCtrl',
                templateUrl: 'home/signin/signin.tpl.html',
                targetEvent: ev
            }).then(function (answer) {
                Authenticated.getUser();
            }, function () {
            });
        };

        $scope.signout = function() {
            Authenticated.signout();
        };

        $scope.$on('auth:loginRequired', function () {
            $log.debug("auth:login required -> token refresh");
            Oauth2Service.refreshToken().then(function () {
                // init logged user
                Authenticated.getUser();
            });
        });
    }

})();