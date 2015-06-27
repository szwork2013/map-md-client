/**
 * Created by tiwen.wang on 4/24/2015.
 */
(function() {
    'use strict';

    angular.module('app.components').
        directive('userProfile', ['staticCtx', '$state', UserProfileDirective]);

    function UserProfileDirective(staticCtx, $state) {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                user: "=user",
                leave: '&?onLeave'
            },
            templateUrl: 'components/user/profile/profile.tpl.html',
            link: link
        };

        function link(scope, element, attrs) {
            scope.staticCtx = staticCtx;

            scope.toUserPage = function(ev) {
                scope.leave(ev);
                $state.go('app.user', {name: scope.user.username});
            };
        }
    }
})();