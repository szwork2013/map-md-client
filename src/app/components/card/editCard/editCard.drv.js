/**
 * Created by tiwen.wang on 6/23/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.card.editCard
     */
    angular.module('app.components.card.editCard', [])
        .directive('editCard', ['$mdTheming', '$timeout', '$log', editCardDirective])
        .controller('EditCardCtrl', ['$scope', '$log', '$timeout', '$q', '$mmdMessage',
            EditCardCtrl]);

    function editCardDirective($mdTheming, $timeout, $log) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {
                cardForm: '=',
                cardUpdated: '=',
                cardRemove: '='
            },
            link: link,
            controller: 'EditCardCtrl as ecc',
            templateUrl: 'components/card/editCard/editCard.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }

    function EditCardCtrl($scope, $log, $timeout, $q, $mmdMessage) {
        var self = this;

        self.reset = function() {

        };
    }
})();