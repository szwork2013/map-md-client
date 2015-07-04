/**
 * Created by tiwen.wang on 7/3/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.feature.card
     */
    angular.module('app.components.feature.card', [])
        .directive('featureCard', ['$mdTheming', '$timeout', '$log', featureCardDirective])
    ;

    function featureCardDirective($mdTheming, $timeout, $log) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                feature: '='
            },
            link: link,
            templateUrl: 'components/feature/card/card.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.filterSecId = function(properties) {
                var result = {};
                angular.forEach(properties, function(value, key) {
                    switch (key) {
                        case 'style':
                            break;
                        default :
                            result[key] = value;
                    }
                });
                return result;
            };
        }
    }
})();