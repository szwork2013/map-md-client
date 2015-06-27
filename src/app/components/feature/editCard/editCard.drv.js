/**
 * Created by tiwen.wang on 6/23/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.feature.editCard
     */
    angular.module('app.components.feature.editCard', [])
        .directive('featureEditCard', ['$mdTheming', '$timeout', '$log', featureEditCardDirective])
        .controller('FeatureEditCardCtrl', ['$scope', '$log', '$timeout', '$q', '$mmdMessage',
            FeatureEditCardCtrl]);

    function featureEditCardDirective($mdTheming, $timeout, $log) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                feature: '=',
                featureUpdated: '=',
                featureRemove: '='
            },
            link: link,
            controller: 'FeatureEditCardCtrl as fecc',
            templateUrl: 'components/feature/editCard/editCard.tpl.html'
        };

        function link(scope, element, attrs) {
        }
    }

    function FeatureEditCardCtrl($scope, $log, $timeout, $q, $mmdMessage) {
        var self = this;

        self.feature = $scope.feature.properties;
        self.originalFeature = angular.copy($scope.feature);

        /**
         * 重置属性
         */
        self.reset = function() {
            self.feature = angular.copy(self.originalFeature.properties);
            $scope.featureUpdated(self.feature);
            $scope.featureForm.$setPristine();
        };

        /**
         * 删除
         */
        self.remove = function() {
            $scope.featureRemove($scope.feature);
        };

        /**
         * 新增一个属性
         */
        self.addProperty = function(e) {
            $log.debug(e.keyCode);
            self.property = {
                key: '',
                value: ''
            };
        };

        self.removeProperty = function(key) {
            delete self.feature[key];
            $scope.featureForm.$setDirty();
        };

        /**
         * 更新Feature的属性
         * @param properties
         */
        self.update = function(properties) {
            if(self.property && self.property.key) {
                properties[self.property.key] = self.property.value;
            }
            $scope.featureUpdated(properties);
            $scope.featureForm.$setPristine();
            delete self.property;
        };

        self.filterSecId = function(properties) {
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
})();