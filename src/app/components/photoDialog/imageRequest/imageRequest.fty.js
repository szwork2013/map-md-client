/**
 * Created by tiwen.wang on 6/27/2015.
 */
(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.imageRequest
     */
    angular.module('app.components')
        .factory('$imageRequest', [ '$timeout', '$q',
            imageRequestFactory]);

    function imageRequestFactory($timeout, $q) {
        return {
            get: imageRequest
        };

        /**
         * XMLHttpRequest方式预加载图片
         *
         * @param $src
         * @returns {*}
         */
        function imageRequest($src) {
            var deferred = $q.defer();

            var req = new XMLHttpRequest();
            req.onprogress = function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = (evt.loaded / evt.total) * 100;
                    deferred.notify(percentComplete);
                }
            };

            req.onload = function (e) {
                $timeout(function () {
                    deferred.resolve($src);
                }, 500);
            };

            req.open("GET", $src, true);
            req.send();
            return deferred.promise;
        }
    }
})();