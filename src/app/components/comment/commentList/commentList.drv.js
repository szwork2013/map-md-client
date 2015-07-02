/**
 * Created by tiwen.wang on 7/2/2015.
 */
(function () {
    'use strict';

    /**
     *
     * @ngdoc module
     * @name app.components.comment.commentList
     */
    angular.module('app.components.comment.commentList', [])
        .directive('commentList', ['$mdTheming', '$q', '$log', 'Comments', CommentListDirective])
    ;

    function CommentListDirective($mdTheming, $q, $log, Comments) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                commentType: '@',
                commentEntity: '=?',
                comments: '='
            },
            link: link,
            templateUrl: 'components/comment/commentList/commentList.tpl.html'
        };

        function link(scope, element, attrs) {
            var pageSize = 20;
            scope.$watch('commentEntity', function(entity) {
                if(entity) {
                    scope.$broadcast('async-card-init');
                    //Comments.get(scope.commentType, scope.commentEntity.id)
                    //    .then(function(comments) {
                    //    scope.comments = comments;
                    //});
                }
            });

            //scope.comments = [];
            scope.loadMore = function(pageNo) {
                var deferred = $q.defer();
                if(scope.commentEntity) {
                    Comments.get(scope.commentType,
                        scope.commentEntity.id,
                        pageNo,
                        pageSize)
                        .then(function(comments) {
                            scope.comments = scope.comments.concat(comments);
                            if(comments.length<pageSize) {
                                deferred.resolve(false);
                            }else {
                                deferred.resolve(true);
                            }
                        },function() {
                            deferred.resolve(false);
                        });
                }else {
                    deferred.resolve(false);
                }
                return deferred.promise;
            };

            scope.loadRest = function() {
                scope.comments.length = 0;
            };
        }
    }

})();