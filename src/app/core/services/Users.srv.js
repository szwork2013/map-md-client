/**
 * Created by tiwen.wang on 4/25/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
    .factory('Authenticated', ['Users', '$q', function(Users, $q) {
        return {
            login: false,
            logout: false,
            getUser: function () {
                var deferred = $q.defer();
                var self = this;
                if(self.login&&self.user) {
                    deferred.resolve(self.user);
                }else if(!self.logout) {
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
            }
        };
    }])
    ;
})();