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
        $scope.profileUploaded = profileUploaded;
        setProfileCover();

        $scope.linkItems = [
            {name: '热门图片', icon: 'maps:map', state: 'app.maps.popular'},
            {name: '轨迹',    icon: 'maps:directions_walk', state: 'app.maps.track.search'}

        ];

        $scope.authItems = [
            {
                name: '图片管理',
                icon: 'image:photo_album',
                state: 'app.photos.all'
            },
            {
                name: '设置',
                icon: 'action:settings_applications',
                state: 'app.settings.account'
            }
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
                setProfileCover();
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
                $log.debug("auth:login required -> signout");
                Authenticate.signout();
            }else {
                $log.debug("auth:login required -> refresh token");
                Oauth2Service.refreshToken().then(function () {
                    $log.debug("auth:login required -> refresh token success");
                    // init logged user
                    Authenticate.getUser().then(function() {
                        $log.debug("auth:login required -> get user success");
                        $rootScope.$broadcast('auth:oauthed');
                    });
                },function(error) {
                    $log.debug(LOG_TAG + "refresh token error");
                    $log.debug(error);
                    Authenticate.signout();
                });
            }
        });

        function profileUploaded(cover) {
            Authenticate.setProfileCover(cover);
            setProfileCover();
        }

        function setProfileCover() {
            if(Authenticate.user&&Authenticate.user.profileCover) {
                $scope.backgroundImage = $scope.staticCtx+"/"+Authenticate.user.profileCover.oss_key;
            }
        }
    }

})();