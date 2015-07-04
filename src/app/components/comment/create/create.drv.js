/**
 * Created by tiwen.wang on 7/2/2015.
 */
(function () {
    'use strict';

    /**
     * 创建评论
     * @ngdoc module
     * @name app.components.comment.create
     */
    angular.module('app.components.comment.create', [])
        .directive('commentCreate', ['$mdTheming', '$timeout', '$log', 'Comments', 'staticCtx',
            CommentCreateDirective])
    ;

    /**
     *
     * @param $mdTheming
     * @param $timeout
     * @param $log
     * @param Comments
     * @param staticCtx
     * @returns {{restrict: string, replace: boolean, scope: {commentType: string, commentEntity: string, saved: string}, link: link, templateUrl: string}}
     * @constructor
     *
     * @usage
     *
     * <hljs lang="html">
     * <comment-create
     *   comment-type="photo"
     *   comment-entity="photo"
     *   on-saved="onSaved(comment)" >
     * </comment-create>
     *
     * </hljs>
     *
     * commentSaved = function({comment:{}}){}
     */
    function CommentCreateDirective($mdTheming, $timeout, $log, Comments, staticCtx) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                commentType: "@",
                commentEntity: "=",
                saved: "&?onSaved"
            },
            link: link,
            templateUrl: 'components/comment/create/create.tpl.html'
        };

        function link(scope, element, attrs) {
            $mdTheming(element);

            scope.staticCtx = staticCtx;

            var status =
                scope.status = {
                    ready:   "ready",
                    writing: "writing",
                    saving:  "saving",
                    saved:   "saved"
                };
            scope.state = scope.status.ready;
            scope.comment = {content: ""};

            scope.changeState = function() {
                switch (scope.state) {
                    case status.ready:
                        scope.state = status.writing;
                        return;
                    case status.saved:
                        scope.state = status.ready;
                        return;
                    case status.writing:
                        if(scope.comment.content) {
                            scope.state = status.saving;
                            // save comment
                            saveComment(scope.comment.content)
                                .then(function(comment) {
                                    scope.state = status.saved;
                                    scope.comment.content = "";
                                    scope.saved({comment: comment});
                                    $timeout(function() {
                                        scope.state = status.ready;
                                    }, 1000);
                                }, function() {
                                    scope.state = status.writing;
                                });
                        }else {
                            scope.state = status.ready;
                        }
                        return;
                    default :
                        scope.state = status.ready;
                }
            };

            /**
             * 创建评论
             * @param content
             * @returns {*}
             */
            function saveComment(content) {
                return Comments.create({
                    type: scope.commentType,
                    id: scope.commentEntity.id,
                    content: content
                });
            }

        }
    }

})();