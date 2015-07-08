/**
 * Created by tiwen.wang on 6/23/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.card
     */
    angular.module('app.components.card', [
        'app.components.card.editCard',
        'app.components.card.asyncCard',
        'app.components.card.formCard'
    ]);
})();