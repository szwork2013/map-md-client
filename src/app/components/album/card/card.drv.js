/**
 * Created by tiwen.wang on 6/15/2015.
 */
(function() {
    'use strict';

    angular.module('app.components.album.card', [])
        .directive('albumCard', ['$mdDialog', '$log', 'staticCtx', 'Albums',
            albumCardDirective]);

    function albumCardDirective($mdDialog, $log, staticCtx, Albums) {
        return {
            restrict: 'EA',
            link: link,
            scope: {
                album: "="
            },
            templateUrl: 'components/album/card/card.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.staticCtx = staticCtx;
        }
    }
})();