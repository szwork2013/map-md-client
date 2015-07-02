/**
 * Created by tiwen.wang on 7/2/2015.
 */
(function () {
    'use strict';

    /**
     *
     * @ngdoc module
     * @name app.components.comment.comment
     */
    angular.module('app.components.comment.comment', [])
        .directive('commentItem', ['$mdTheming', '$timeout', '$log', 'Comments', 'UrlService', '$state',
            CommentItemDirective])
    ;

    function CommentItemDirective($mdTheming, $timeout, $log, Comments, UrlService, $state) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                comment: '=',
                user: '='
            },
            link: link,
            templateUrl: 'components/comment/comment/comment.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.UrlService = UrlService;

            scope.toUserPage = function(e) {
                scope.$emit('$state-go');
                $state.go('app.user', {name: scope.comment.user.username});
            };
        }
    }

})();