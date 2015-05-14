/**
 * Created by tiwen.wang on 4/25/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
    .factory('Authenticated', ['Users', '$q', 'Oauth2Service',
            function(Users, $q, Oauth2Service) {
        return {
            login: false,
            logout: true,
            getUser: function () {
                var deferred = $q.defer();
                var self = this;
                if(self.login&&self.user) {
                    deferred.resolve(self.user);
                }else if(!self.login && self.logout) {
                    Users.me().then(function(res) {
                        self.login = true;
                        self.user = {
                            "id": res.id,
                            "username": res.username,
                            "name": res.name,
                            "avatar": res.avatar,
                            "photoCount": res.photo_count,
                            "photoViews": res.photo_views
                        };
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
            }
        };
    }])
    ;
})();