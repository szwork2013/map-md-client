/**
 * Created by tiwen.wang on 5/6/2015.
 */
(function() {

    'use strict';

    angular.module('app.core.services')
        .factory('Travels', ['ApiRestangular', TravelsServiceFactory])
    ;

    function TravelsServiceFactory(Restangular) {
        var travelService = Restangular.service('travel');
        Restangular.extendModel('travel', function(model) {
            //model.getCameraInfo = function() {
            //    return this.one('camerainfo').get();
            //};
            //model.getComments = function() {
            //    return this.all('comment').getList();
            //};
            return model;
        });
        return {
            get: getTravel
        };

        function getTravel(id) {
            return travelService.one(id).get();
        }
    }
})();
