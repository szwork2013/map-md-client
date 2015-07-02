/**
 * Created by tiwen.wang on 6/30/2015.
 */
(function() {
    'use strict';

    /**
     * 专辑封面截取的card，从地图截取
     * 使用leaflet-image插件 https://github.com/mapbox/leaflet-image
     * @ngdoc module
     * @name app.components.album.card
     */
    angular.module('app.components.album.cover', [])
        .directive('albumCover', ['$mdDialog', '$log', 'staticCtx', '$state',
            albumCoverDirective]);

    function albumCoverDirective($mdDialog, $log, staticCtx, $state) {
        return {
            restrict: 'EA',
            link: link,
            scope: {
                album: "=",
                map: "="
            },
            templateUrl: 'components/album/cover/cover.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.staticCtx = staticCtx;

            var images = element.find(".cover-image");

            scope.takeCover = function() {
                leafletImage(scope.map, function(err, canvas) {
                    // now you have canvas
                    // example thing to do with that canvas:
                    var img = document.createElement('img');
                    var dimensions = scope.map.getSize();
                    img.width = dimensions.x;
                    img.height = dimensions.y;
                    img.src = canvas.toDataURL();
                    images.innerHTML = '';
                    images.append(img);
                });
            };
        }
    }
})();