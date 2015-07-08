/**
 * Created by tiwen.wang on 6/15/2015.
 */
(function() {
    'use strict';

    /**
     * 展示专辑的card，可进行编辑 查看转向
     * @ngdoc module
     * @name app.components.album.card
     */
    angular.module('app.components.album.card', [])
        .directive('albumCard', ['$mdDialog', '$log', 'UrlService', '$state',
            albumCardDirective]);

    function albumCardDirective($mdDialog, $log, UrlService, $state) {
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
            scope.UrlService = UrlService;

            if(scope.album&&!scope.album.cover) {
                scope.album.cover = scope.album.photos[0];
            }

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