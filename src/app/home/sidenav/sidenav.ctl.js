/**
 * Created by tiwen.wang on 4/23/2015.
 */
(function () {
    'use strict';

    angular.module('app.home.sidenav', [] )
        .controller('SidenavCtrl',
        ['$rootScope', '$scope', '$mdSidenav', '$log', '$q', 'Authenticate', 'Oauth2Service', '$state',
            SidenavCtrl]);

    var LOG_TAG = "Home-Sidenav: ";

    /**
     *
     * @param $rootScope
     * @param $scope
     * @param $mdSidenav
     * @param $log
     * @param $q
     * @param Authenticate
     * @param Oauth2Service
     * @param $state
     * @constructor
     */
    function SidenavCtrl($rootScope, $scope, $mdSidenav, $log, $q, Authenticate, Oauth2Service, $state) {
        var self = this;

        $scope.Authenticate = Authenticate;

        $scope.linkItems = [
            {name: '热门图片', icon: 'maps:map', state: 'app.maps.popular'},
            //{name: 'Track', icon: 'maps:directions_walk', state: 'app.maps.track.search'},
            {name: 'GeoJSON', icon: 'image:photo_album', state: 'app.maps.geojson.search'},
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
            Authenticate.openSignin(ev).then(function() {
                $log.debug(LOG_TAG + "signed in");
            }, function() {
                $log.debug(LOG_TAG + "sign in fail");
            });
        };

        $scope.signup = function(ev) {
            Authenticate.openSignup(ev).then(function(user) {
                $scope.signin(ev);
            });
        };

        $scope.signout = function() {
            Authenticate.signout();
        };

        $scope.$on('auth:loginRequired', function () {
            $log.debug("auth:login required -> token refresh");
            if(!Authenticate.user) {
                //$scope.signin();
            }else {
                Oauth2Service.refreshToken().then(function () {
                    // init logged user
                    Authenticate.getUser().then(function() {
                        $rootScope.$broadcast('auth:oauthed');
                    });
                },function(error) {
                    $log.debug(LOG_TAG + "refresh token error");
                    $log.debug(error);
                    Authenticate.signout();
                });
            }
        });
    }

})();