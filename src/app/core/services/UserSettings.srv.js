/**
 * Created by tiwen.wang on 6/2/2015.
 */
(function() {

    'use strict';

    angular.module('app.core.services')
        .factory('UserSettings', ['ApiRestangular', UserSettingsServiceFactory])
    ;

    function UserSettingsServiceFactory(Restangular) {
        var service = Restangular.service('settings');
        Restangular.extendModel('settings', function(model) {
            model.map = function() {
                return this.post('map', this);
            };
            //model.getComments = function() {
            //    return this.all('comment').getList();
            //};
            return model;
        });
        return {
            get: getSetting
        };

        function getSetting(id) {
            return service.one(id).get();
        }
    }
})();