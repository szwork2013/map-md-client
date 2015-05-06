/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.photoCard
     */

    angular.module('app.components.photoCard', ['ngMaterial'])
        .directive('mmdPhotoCard', ['$mdTheming', '$mmdPhotoDialog', MmdPhotoCard])
    ;

    function MmdPhotoCard($mdTheming, $mmdPhotoDialog) {

        return {
            restrict: 'E',
            link: link,
            scope: {
                photoId: "=mmdPhotoId",
                photoColor: "=mmdPhotoColor",
                photoUrl: "@mmdPhotoUrl",
                photoSize: "=mmdPhotoSize",
                photoIs360: "=mmdPhotoIs360",
                photoAddress: "=mmdPhotoAddress",
                photoDescription: "=mmdPhotoDescription"
            },
            templateUrl: 'components/photoCardWall/photoCard.tpl.html'
        };

        function link (scope, element, attrs) {
            $mdTheming(element);

            if(scope.photoColor) {
                element.css('background-color', scope.photoColor);
            }

            /**
             * display photo in photo dialog
             * @param $event
             * @param photoId
             */
            scope.displayPhoto = function($event, photoId) {
                $mmdPhotoDialog.show($event, {id: photoId});
            };
        }
    }

})();