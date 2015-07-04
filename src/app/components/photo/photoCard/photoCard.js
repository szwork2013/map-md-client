/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.photo.photoCard
     */

    angular.module('app.components.photo.photoCard', ['ngMaterial'])
        .directive('mmdPhotoCard', ['$mdTheming', '$mmdPhotoDialog', MmdPhotoCard])
    ;

    function MmdPhotoCard($mdTheming, $mmdPhotoDialog) {

        return {
            restrict: 'E',
            link: link,
            scope: {
                photo: "=",
                photoSelectable: '=',
                actionSelected: '=',
                photoUrl: "@mmdPhotoUrl"
            },
            templateUrl: 'components/photo/photoCard/photoCard.tpl.html'
        };

        function link (scope, element, attrs) {
            $mdTheming(element);

            if(scope.photoColor) {
                element.css('background-color', scope.photo.color);
            }

            /**
             * display photo in photo dialog
             * @param $event
             * @param photoId
             */
            scope.displayPhoto = function($event, photo) {
                $mmdPhotoDialog.show($event, {id: photo.id});
            };
        }
    }

})();