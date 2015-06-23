/**
 * Created by tiwen.wang on 4/25/2015.
 */
(function() {
    'use strict';

    angular.module('app.core.services')
        .factory('Signup', ['ApiRestangular', SignupServiceFactory])
        .factory('Authenticate', ['$q', '$mdDialog', 'Users', 'Oauth2Service',
            AuthenticateFactory])
        .factory('Users', ['ApiRestangular', UsersServiceFactory])
    ;

    function SignupServiceFactory(Restangular) {
        return {
            signup: signup
        };

        function signup(user) {
            return Restangular.service('signup').post(user);
        }
    }

    function AuthenticateFactory($q, $mdDialog, Users, Oauth2Service) {
        return {
            login: false,
            logout: true,
            getUser: function () {
                var deferred = $q.defer();
                var self = this;
                if(self.login&&self.user) {
                    deferred.resolve(self.user);
                }else if(!self.login && self.logout) {
                    Users.me().then(function(user) {
                        self.login = true;
                        self.user = user;
                        deferred.resolve(self.user);
                    });
                }else {
                    deferred.reject();
                }
                return deferred.promise;
            },
            signout: function() {
                this.login = false;
                this.logout = true;
                delete this.user;
                Oauth2Service.removeToken();
            },
            signup: function() {

            },
            openSignin: function(ev) {
                return $mdDialog.show({
                    controller: 'SigninCtrl',
                    templateUrl: 'home/signin/signin.tpl.html',
                    targetEvent: ev
                });
            },
            openSignup: function(ev) {
                return $mdDialog.show({
                    controller: 'SignupCtrl',
                    templateUrl: 'home/signup/signup.tpl.html',
                    targetEvent: ev
                });
            }
        };
    }

    function UsersServiceFactory(Restangular) {
        var service = Restangular.service('user');
        Restangular.extendModel('user', function(model) {
            model.saveAccount = function() {
                return this.post('account', this);
            };
            return model;
        });
        return {
            me: getMe,
            get: getOpenInfo,
            getUser: getUser,
            getByUsername: getByUsername,
            getPhotos: getPhotos,
            uploadAvatar: uploadAvatar,
            saveAccount: saveAccount,
            getAlbums: getAlbums
        };

        function getMe() {
            return service.one().get();
        }

        function getOpenInfo(id) {
            return service.one(id).one('openinfo').get();
        }

        function getUser(id) {
            return service.one(id).get();
        }

        function getByUsername(name) {
            return service.one().get({name: name});
        }

        function getPhotos(id, pageSize, pageNo) {
            return service.one(id).one('photos', pageSize).all(pageNo).getList();
        }

        function uploadAvatar(data) {
            var boundary = Math.random().toString().substr(2);
            var multipart = "";
            multipart += "--" + boundary +
                "\r\nContent-Disposition: form-data; name=" +
                "\"file\"" + '; filename="avatar.png"' +
                "\r\nContent-type: application/octet-stream" +
                "\r\n\r\n" + data + "\r\n";

            multipart += "--" + boundary + "--\r\n";

            return service.one().post('avatar', multipart, {}, {
                "Content-Type": "multipart/form-data; charset=utf-8; boundary=" + boundary
            });
        }

        function saveAccount(user) {
            return service.one(user.id).post('account', user);
        }

        function getAlbums(id) {
            return service.one(id).all('albums').getList();
        }
    }
})();