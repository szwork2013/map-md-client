/**
 * Created by tiwen.wang on 4/27/2015.
 */
(function() {
    'use strict';

    angular.module('app.components')
        .directive('mmdComment', ['UrlService', MmdCommentDirective])
        .directive('postComment', ['UrlService', CommentDirective]);

    function MmdCommentDirective(UrlService) {

        return {
            restrict: 'EA',
            link: link,
            scope: {
                comment: "="
            },
            templateUrl: 'components/comment/mmdComment.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.UrlService = UrlService;
        }
    }

    function CommentDirective(UrlService) {

        return {
            restrict: 'EA',
            link: link,
            scope: {

            },
            templateUrl: 'components/comment/comment.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.UrlService = UrlService;
        }
    }
})();