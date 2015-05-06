/**
 * Created by tiwen.wang on 4/27/2015.
 */
(function() {
    'use strict';

    angular.module('app.components').
        directive('mmdComments', ['staticCtx', CommentsDirective]);

    function CommentsDirective(staticCtx) {

        var defaultOptions = {
            type: "photo"
        };

        return {
            restrict: 'EA',
            link: link,
            scope: {
                comments: "=",
                options: "=mmdCommentsOptions"
            },
            templateUrl: 'components/comment/comments.tpl.html'
        };

        function link(scope, element, attrs) {

            var options = {};

            angular.extend(options, defaultOptions, scope.options);

            scope.comment = {
                commentLimit: options.commentLimit,
                limit: options.commentLimit || ( scope.comments && scope.comments.length)
            };
        }
    }
})();