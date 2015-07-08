/**
 * Created by tiwen.wang on 4/27/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .factory('UrlService', ['staticCtx', UrlServiceFactory]);

    function UrlServiceFactory(staticCtx) {
        return {
            getAvatarUrl: getAvatarUrl,
            getPhotoUrl: getPhotoUrl,
            getAlbumCover: getAlbumCover
        };

        function getAvatarUrl(avatar) {
            return avatar ? staticCtx + '/cover' + avatar.id + '.png' :
            staticCtx + '/cover1.png' ;
        }

        function getPhotoUrl(image, style) {
            if(!image||!image.oss_key) {
                return '';
            }
            var url = staticCtx + '/' + image.oss_key;
            if(style) {
                url = url + '@!' + style;
            }
            return url;
        }

        function getAlbumCover(image) {
            if(!image||!image.oss_key) {
                return 'assets/images/album-cover.jpg';
            }else {
                return staticCtx + '/' + image.oss_key+'@1e_200w_200h_1c_1o.jpg';
            }
        }
    }
})();