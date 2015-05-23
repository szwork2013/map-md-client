/**
 * Created by tiwen.wang on 4/24/2015.
 */
(function() {
    'use strict';

    angular.module('app.components').
        directive('userProfile', ['staticCtx', UserProfileDirective]);

    function UserProfileDirective(staticCtx) {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                user: "=user"
            },
            templateUrl: 'components/user/profile/profile.tpl.html',
            link: link
        };

        function link(scope, element, attrs) {
            scope.staticCtx = staticCtx;
        }
    }
})();