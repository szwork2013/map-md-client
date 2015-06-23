/**
 * Created by tiwen.wang on 6/2/2015.
 */
(function() {
    'use strict';

    angular.module('app.home.message', [])
        .factory('$mmdMessage', ['$window', '$timeout', '$mdToast',
            function ($window, $timeout, $mdToast) {

                var toastPosition = {
                    bottom: false,
                    top: true,
                    left: false,
                    right: true
                };
                var getToastPosition = function() {
                    return Object.keys(toastPosition)
                        .filter(function(pos) { return toastPosition[pos]; })
                        .join(' ');
                };
                var showMessage = function(content, position) {
                    var toast = $mdToast.simple()
                        .content(content)
                        .highlightAction(false)
                        .position(position || getToastPosition());

                    return $mdToast.show(toast);
                };

                function createSuccess(message) {
                    showMessage("创建成功 " + (message || ''));
                }
                function saveSuccess(message) {
                    showMessage("保存成功 " + (message || ''));
                }
                function updateSuccess(message) {
                    showMessage("更新成功 " + (message || ''));
                }
                function removeSuccess(message) {
                    showMessage("删除成功 " + (message || ''));
                }
                function createFail(err) {
                    showMessage("创建失败 " + getMessage(err));
                }
                function saveFail(err) {
                    showMessage("保存失败 " + getMessage(err));
                }
                function updateFail(err) {
                    showMessage("更新失败 " + getMessage(err));
                }
                function removeFail(err) {
                    showMessage("删除失败 " + getMessage(err));
                }

                function getMessage(err) {
                    if(angular.isObject(err)) {
                        if(err.status === 401) {
                            return "未登录";
                        }
                    }else if(angular.isString(err)) {
                        return err;
                    }

                    return '';
                }
                return {
                    showMessage: showMessage,
                    success: {
                        create: createSuccess,
                        save: saveSuccess,
                        update: updateSuccess,
                        remove: removeSuccess
                    },
                    fail: {
                        create: createFail,
                        save: saveFail,
                        update: updateFail,
                        remove: removeFail
                    }
                };

            }])
    ;
})();