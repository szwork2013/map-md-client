/**
 * Created by tiwen.wang on 7/1/2015.
 */
(function () {
    'use strict';

    /**
     *
     * @ngdoc module
     * @name app.components.card.asyncCard
     */
    angular.module('app.components.card.asyncCard', [])
        .directive('asyncCard', ['$mdTheming', '$timeout', '$log', AsyncCardDirective])
        .controller('AsyncCardCtrl', ['$scope', '$log', '$timeout', '$q', '$mmdMessage',
            AsyncCardCtrl]);

    /**
     * loadMore对应一个funciton 输入参数pageNo 返回一个promise
     *   promise resolve结果为true，则pageNo加 1
     *           resolve结果为false，则没有更多结果可加载
     * loadReset 对应一个funciton 做清空操作
     * noBorder 为true时设置card为无边class
     *
     * @param $mdTheming
     * @param $timeout
     * @param $log
     * @returns {{restrict: string, transclude: boolean, scope: {loadMore: string, loadReset: string, noBorder: string}, link: link, controller: string, templateUrl: string}}
     * @constructor
     */
    function AsyncCardDirective($mdTheming, $timeout, $log) {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                loadMore: '=',
                loadReset: '&?',
                noBorder: '=?'
            },
            link: link,
            controller: 'AsyncCardCtrl as acc',
            templateUrl: 'components/card/asyncCard/asyncCard.tpl.html'
        };

        function link(scope, element, attrs) {
            if(scope.noBorder) {
                element.addClass("md-card-no-border");
            }
        }
    }

    function AsyncCardCtrl($scope, $log, $timeout, $q, $mmdMessage) {
        var self = this;
        $scope.loading = false;
        $scope.pageNo = 0;

        $scope.more = function() {
            $scope.loading = true;
            $scope.loadMore($scope.pageNo).then(function(res) {
                $scope.loading = false;
                if(res) {
                    $scope.pageNo++;
                }else {
                    $scope.loadDone = true;
                }
            },function(err) {
                $scope.loading = false;

            });
        };

        /**
         * 重置页码为首页，并加载
         */
        $scope.reset = function() {
            $scope.loadReset();
            $scope.pageNo = 0;
            $scope.loadDone = false;
            $scope.loading = false;
            $scope.more();
        };

        $scope.$on('async-card-init', function(e, d) {
            $scope.reset();
        });

        // init
        $scope.more();
    }
})();