/**
 * Created by tiwen.wang on 5/13/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .factory('$mmdLeafletUtil', ['staticCtx', function (staticCtx) {

            return {
                photoMarker: function(photo, map) {
                    var self = this;
                    var myIcon = L.divIcon({
                        className: 'icon-marker',
                        html: '<img src="' + self._getIconUrl(photo.oss_key) + '">'
                    });
                    var markerStyle = {icon: myIcon, riseOnHover: true};
                    var marker = L.marker(photo.point, markerStyle);
                    if(map) {
                        marker.on('click', function(e) {
                            map.fire('photoClick', {originEvent: e, photoId: photo.id});
                        });
                    }
                    return marker;
                },
                _getIconUrl: function(photoOssKey) {
                    return staticCtx + "/" + photoOssKey + "@!panor-lg";
                }
            };
        }])
    ;
})();