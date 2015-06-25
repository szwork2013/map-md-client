/**
 * Created by tiwen.wang on 6/15/2015.
 */
(function() {
    'use strict';

    angular.module('app.components.album.card', [])
        .directive('albumCard', ['$mdDialog', '$log', 'staticCtx', '$state',
            albumCardDirective]);

    function albumCardDirective($mdDialog, $log, staticCtx, $state) {
        return {
            restrict: 'EA',
            link: link,
            scope: {
                album: "=",
                editable: "="
            },
            templateUrl: 'components/album/card/card.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.staticCtx = staticCtx;

            scope.go = function(state, params) {
                $state.go(state, params);
            };

            scope.goEdit = function(album) {
                if(album.type=='Base') {
                    $state.go("app.maps.upload", {album: album.id});
                }else {
                    $state.go("app.maps.album.fc.edit", {id: album.id});
                }
            };
            scope.goDisplay = function(album) {
                $state.go("app.maps.album.display", {userName: album.user.username, albumName: album.name});
            };
        }
    }
})();