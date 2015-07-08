/**
 * Created by tiwen.wang on 7/5/2015.
 */
(function() {
    'use strict';

    /**
     * 用户自定义主页的刊头
     * @ngdoc module
     * @name app.home.masthead
     */
    angular.module('app.home.masthead', [])
        .directive('mdMasthead', ['$mdBottomSheet', '$mdSidenav', '$q', 'staticCtx', MdMastheadDirective]);

    function MdMastheadDirective($mdBottomSheet, $mdSidenav, $q, staticCtx) {
        return {
            restrict: 'EA',
            transclude: true,
            link: link,
            scope: {
                mastheadUser: '='
            },
            templateUrl: 'home/masthead/masthead.tpl.html'
        };

        function link(scope, element, attrs) {

            scope.toggleLeftBar = function () {
                var pending = $mdBottomSheet.hide() || $q.when(true);

                pending.then(function(){
                    $mdSidenav('left').toggle();
                });
            };

            scope.$watch('mastheadUser.mastheadCover', function() {
                if(scope.mastheadUser&&scope.mastheadUser.mastheadCover) {
                    scope.backgroundImage = staticCtx+"/"+scope.mastheadUser.mastheadCover.oss_key;
                }
            });

        }
    }
})();