/**
 * Created by tiwen.wang on 6/25/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.like
     */
    angular.module('app.components.like', [])
        .directive('likeButton', ['$mdTheming', '$timeout', '$log', 'Likes', likeButtonDirective])
    ;

    function likeButtonDirective($mdTheming, $timeout, $log, Likes) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                likeType: '@',
                likeEntity: '=?',
                like: '=?'
            },
            link: link,
            templateUrl: 'components/like/like.tpl.html'
        };

        function link(scope, element, attrs) {
            scope.$watch('likeEntity', function(entity) {
                if(entity) {
                    Likes.isLike(scope.likeType, scope.likeEntity.id).then(function(res) {
                        if(res) {
                            scope.like = true;
                        }else {
                            scope.like = false;
                        }
                    });
                }
            });

            scope.dolike = function(entity) {
                if(scope.like) {
                    Likes.unLike(scope.likeType, scope.likeEntity.id).then(function() {
                        scope.like = false;
                    });
                }else {
                    Likes.like(scope.likeType, scope.likeEntity.id).then(function() {
                        scope.like = true;
                    });
                }

            };
        }
    }
})();