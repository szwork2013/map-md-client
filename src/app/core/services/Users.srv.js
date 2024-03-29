/**
 * Created by tiwen.wang on 4/25/2015.
 */
(function() {
    'use strict';

    angular.module('app.core.services')
        .factory('Signup', ['ApiRestangular', SignupServiceFactory])
        .factory('Authenticate', ['$q', '$mdDialog', 'Users', 'Oauth2Service', 'localStorageService',
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

    function AuthenticateFactory($q, $mdDialog, Users, Oauth2Service, localStorageService) {
        var userStoreName = "user";
        return {
            login: false,
            logout: true,
            getUser: function () {
                var deferred = $q.defer();
                var self = this;
                if(self.login&&self.user) {
                    deferred.resolve(self.user);
                }else if(!self.login && self.logout) {
                    var user = this.getStorage(userStoreName);
                    if(user) {
                        self.login = true;
                        self.user = user;
                        deferred.resolve(self.user);
                    }else {
                        Users.me().then(function(user) {
                            self.login = true;
                            self.user = user;
                            self.saveStorage(user);
                            deferred.resolve(self.user);
                        },function(err) {
                            deferred.reject();
                        });
                    }

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
                this.removeStorage();
            },
            saveStorage: function(user) {
                localStorageService.set(userStoreName, user);
            },
            getStorage: function() {
                return localStorageService.get(userStoreName);
            },
            removeStorage: function() {
                localStorageService.remove(userStoreName);
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
            },
            isMe: function(user) {
                var deferred = $q.defer();
                this.getUser().then(function(me) {
                    deferred.resolve(user && user.id == me.id);
                },function(err) {
                    deferred.resolve(false);
                });
                return deferred.promise;
            },
            isMy: function(entity) {
                var deferred = $q.defer();
                this.getUser().then(function(user) {
                    deferred.resolve(entity && entity.user && entity.user.id == user.id);
                },function(err) {
                    deferred.resolve(false);
                });
                return deferred.promise;
            },
            setAvatarCover: function(cover) {
                this.user.avatar = cover;
                this.saveStorage(this.user);
            },
            setProfileCover: function(cover) {
                this.user.profileCover = cover;
                this.saveStorage(this.user);
            },
            setMastheadCover: function(cover) {
                this.user.mastheadCover = cover;
                this.saveStorage(this.user);
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
            //get: getOpenInfo,
            getUser: getUser,
            getByUsername: getByUsername,
            getPhotos: getPhotos,
            saveAvatar: saveAvatar,
            uploadAvatar: uploadAvatar,
            saveAccount: saveAccount,
            getAlbums: getAlbums,
            getGroups: getGroups
        };

        function getMe() {
            return service.one().get();
        }

        //function getOpenInfo(id) {
        //    return service.one(id).one('openinfo').get();
        //}

        function getUser(id) {
            return service.one(id).get();
        }

        function getByUsername(name) {
            return service.one().get({name: name});
        }

        function getPhotos(id, pageSize, pageNo) {
            return service.one(id).all('photos').getList({pageNo: pageNo, pageSize: pageSize});
        }

        function saveAvatar(id, imageId) {
            return service.one(id).one('avatar').post(imageId);
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

        function getAlbums(id, pageNo, pageSize) {
            return service.one(id).all('albums').getList({pageNo: pageNo, pageSize: pageSize});
        }

        function getGroups(id, pageNo, pageSize) {
            return service.one(id).all('groups').getList({pageNo: pageNo, pageSize: pageSize});
        }
    }
})();