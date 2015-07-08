/**
 * Created by tiwen.wang on 7/4/2015.
 */
(function () {
    'use strict';

    /**
     *
     * @ngdoc module
     * @name app.components.photo
     */
    angular.module('app.components.photo', [
        'app.components.photo.image',
        'app.components.photo.photoCard',
        'app.components.photo.photoCardWall',
        'app.components.photo.cover',
        'app.components.photo.backgroundImage'
    ])
    ;
})();