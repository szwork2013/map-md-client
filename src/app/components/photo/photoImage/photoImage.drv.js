/**
 * Created by tiwen.wang on 7/4/2015.
 */
(function () {
    'use strict';

    /**
     *
     * @ngdoc module
     * @name app.components.photo.image
     */
    angular.module('app.components.photo.image', [])
        .directive('photoImage', ['$mdTheming', '$timeout', '$log', 'UrlService', PhotoImageDirective])
    ;

    function PhotoImageDirective($mdTheming, $timeout, $log, UrlService) {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                photo: '='
            },
            link: link,
            templateUrl: 'components/photo/photoImage/photoImage.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.UrlService = UrlService;
        }
    }
})();