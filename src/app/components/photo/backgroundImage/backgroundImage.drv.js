/**
 * Created by tiwen.wang on 7/5/2015.
 */
(function() {
    'use strict';

    /**
     * 可更换的背景图片
     * @ngdoc module
     * @name app.components.photo.backgroundImage
     */
    angular.module('app.components.photo.backgroundImage', [])
        .directive('backgroundImage', ['$q', BackgroundImageDirective]);

    function BackgroundImageDirective($q) {
        return {
            restrict: 'A',
            link: link,
            scope: {
                backgroundImage: '@'
            }
        };

        function link(scope, element, attrs) {
            attrs.$observe('backgroundImage', function(src) {
                element.css('background-image', 'url('+scope.backgroundImage+')');
                element.css('background-size', 'cover');
            });
        }
    }
})();