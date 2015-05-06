/**
 * Created by tiwen.wang on 4/27/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .factory('UrlService', ['staticCtx', UrlServiceFactory]);

    function UrlServiceFactory(staticCtx) {
        return {
            getAvatarUrl: getAvatarUrl
        };

        function getAvatarUrl(avatarId) {
            return staticCtx + '/avatar' + (avatarId || 1) + '.png';
        }
    }
})();