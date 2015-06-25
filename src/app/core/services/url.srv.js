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
            return avatarId ? staticCtx + '/cover' + avatarId + '.png' :
            staticCtx + '/avatar1.png' ;
        }
    }
})();