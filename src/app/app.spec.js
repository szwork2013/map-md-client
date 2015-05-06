describe( 'AppCtrl', function() {
  describe( 'isCurrentUrl', function() {
    var AppCtrl, $location, $scope;

    beforeEach( module( 'app' ) );

    beforeEach( inject( function( $controller, $rootScope, $mdSidenav, $mdBottomSheet, $mdDialog, $log, $q) {
      //$location = _$location_;
      $scope = $rootScope.$new();
      AppCtrl = $controller( 'AppCtrl',
          { $scope: $scope,
            $mdSidenav: $mdSidenav,
            $mdBottomSheet: $mdBottomSheet,
            $mdDialog: $mdDialog,
            $log: $log,
            $q: $q
          });
    }));

    it( 'should pass a dummy test', inject( function() {
      expect( AppCtrl ).toBeTruthy();
    }));

  });
});
