/**
 * Created by tiwen.wang on 7/2/2015.
 */
(function () {
    'use strict';

    /**
     * 评论模块
     * @ngdoc module
     * @name app.components.comment
     */
    angular.module('app.components.comment', [
        'app.components.comment.commentList',
        'app.components.comment.comment',
        'app.components.comment.create'
    ]);
})();