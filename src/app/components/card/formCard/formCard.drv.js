/**
 * Created by tiwen.wang on 7/7/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.card.formCard
     */
    angular.module('app.components.card.formCard', [])
        .directive('formCard', ['$mdTheming', '$timeout', '$log', formCardDirective])
        .controller('FormCardCtrl', ['$scope', '$log', '$timeout', '$q', '$mmdMessage',
            FormCardCtrl]);

    var LOG_TAG = "[formCard] ";

    function formCardDirective($mdTheming, $timeout, $log) {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                cardTitle: '@?',
                formName: '=',
                submitName: '@?',
                formSubmit: '&?'
            },
            link: link,
            controller: 'FormCardCtrl as fcc',
            templateUrl: 'components/card/formCard/formCard.tpl.html'
        };

        function link(scope, element, attrs) {

        }
    }

    function FormCardCtrl($scope, $log, $timeout, $q, $mmdMessage) {
        var self = this;
        $scope.$watch('formCardForm', function(formCardForm) {
            if(formCardForm) {
                $scope.formName = formCardForm;
                $log.debug(LOG_TAG + "inited form");
            }
        });

        self.reset = function() {

        };
    }
})();