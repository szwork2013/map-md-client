/**
 * Created by tiwen.wang on 7/6/2015.
 */
(function () {
    'use strict';

    /**
     * 可更换的背景图片
     * @ngdoc module
     * @name app.components.photo.cover
     */
    angular.module('app.components.photo.cover', [])
        .directive('coverUpload', ['$rootScope', '$log', 'Upload', 'serverBaseUrl', CoverUploadDirective]);

    var LOG_TAG = "[Cover upload] ";

    function CoverUploadDirective($rootScope, $log, Upload, serverBaseUrl) {
        return {
            restrict: 'EA',
            link: link,
            scope: {
                coverType: '@',
                coverUploaded: '&?'
            },
            templateUrl: 'components/photo/cover/cover.tpl.html'
        };

        function link(scope, element, attrs) {

            scope.progressPercentage = 0;

            scope.fileSelected = function (files, e) {
                if (files && files.length) {
                    upload(files[0]);
                }
            };

            function upload(file) {
                Upload.upload({
                    url: serverBaseUrl+'/api/rest/cover',
                    fields: {'type': scope.coverType||''},
                    file: file
                }).progress(function (evt) {
                    $rootScope.safeApply(scope, function() {
                        scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 0);
                        //$log.debug(LOG_TAG + scope.progressPercentage);
                    });
                }).success(function (data, status, headers, config) {
                    scope.coverUploaded({cover: data});
                });
            }
        }
    }
})();