/**
 * Created by tiwen.wang on 6/29/2015.
 */
(function() {
    'use strict';

    /**
     * 专辑的底图类型选择的button，调用底图选择dialog
     * @ngdoc module
     * @name app.components.album.mapSelector
     */
    angular.module('app.components.album.mapSelector', [])
        .directive('mapSelector', ['$mdDialog', '$log', '$MapSelectDialog', '$state',
            mapSelectorDirective]);

    function mapSelectorDirective($mdDialog, $log, $MapSelectDialog, $state) {
        return {
            restrict: 'EA',
            link: link,
            scope: {
                maps: '=',
                multiple: '=?',
                readonly: '=?',
                placeholder: '@?',
                secondaryPlaceholder: '@?'
            },
            templateUrl: 'components/album/mapSelector/mapSelector.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.getMap = function(ev) {
                $MapSelectDialog.show(ev, scope.multiple).then(function(maps) {
                    scope.maps.length = 0;
                    scope.maps = scope.maps.concat(maps);
                });
            };
        }
    }
})();