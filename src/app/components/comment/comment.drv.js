/**
 * Created by tiwen.wang on 4/27/2015.
 */
(function() {
    'use strict';

    angular.module('app.components')
        .directive('mmdComment', ['UrlService', MmdCommentDirective])
        .directive('postComment', ['UrlService', 'Comments', '$timeout', PostCommentDirective]);

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

    /**
     *
     * @param UrlService
     * @param Comments
     * @param $timeout
     * @returns {{restrict: string, link: link, scope: {type: string, entityId: string, saved: string}, templateUrl: string}}
     * @constructor
     *
     * @usage
     *
     * <hljs lang="html">
     * <post-comment type="" entity-id="" on-saved="" >
     * </post-comment>
     *
     * <post-comment
     *   type="photo"
     *   entity-id="photo.id"
     *   on-saved="commentSaved">
     * </post-comment>
     * </hljs>
     *
     * commentSaved = function(comment){}
     */
    function PostCommentDirective(UrlService, Comments, $timeout) {

        return {
            restrict: 'EA',
            link: link,
            scope: {
                type: "@",
                entityId: "=",
                saved: "=?onSaved"
            },
            templateUrl: 'components/comment/comment.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.UrlService = UrlService;

            scope.saved = scope.saved || angular.noop;

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
                                    scope.saved(comment);
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
                    type: scope.type,
                    entity_id: scope.entityId,
                    content: content
                });
            }

        }
    }
})();