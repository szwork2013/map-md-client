/**
 * Created by tiwen.wang on 5/22/2015.
 */
(function() {
    'use strict';

    angular.module('app.components')
        .directive('mmdFooter', [MmdFooterDirective]);

    function MmdFooterDirective() {
        return {
            restrict: 'EA',
            link: link,
            scope: {
            },
            templateUrl: 'home/footer/footer.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }
})();