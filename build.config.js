/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    
    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    less: ['src/less/main.less'],
    scss: ['src/app/app.scss']
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/jquery/dist/jquery.min.js',
      'vendor/angular/angular.min.js',
      //'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      //'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.min.js',
      //'vendor/angular-ui-utils/modules/route/route.min.js',
      'vendor/angular-animate/angular-animate.min.js',
      'vendor/angular-sanitize/angular-sanitize.min.js',
      'vendor/angular-aria/angular-aria.min.js',
      'vendor/angular-material/angular-material.min.js',
      //'vendor/angular-leaflet-directive/dist/angular-leaflet-directive.js',
      'vendor/ng-file-upload/dist/ng-file-upload-shim.min.js',
      'vendor/ng-file-upload/dist/ng-file-upload.min.js',
      'vendor/leaflet/dist/leaflet.js',
      'vendor/Leaflet.markercluster/dist/leaflet.markercluster.js',
      'vendor/Leaflet.heat/dist/leaflet-heat.js',
      'vendor/leaflet-omnivore/leaflet-omnivore.min.js',
      //'vendor/leaflet.elevation/dist/Leaflet.Elevation-0.0.2.min.js',
      'vendor/leaflet.locatecontrol/dist/L.Control.Locate.min.js',
      //'vendor/leaflet.editable/src/Leaflet.Editable.js',
      //'vendor/Leaflet.GeometryUtil/dist/leaflet.geometryutil.js',
      //'vendor/Leaflet.Snap/leaflet.snap.js',
      'vendor/lodash/lodash.min.js',
      'vendor/restangular/dist/restangular.min.js',
      'vendor/jquery-plugins/color-thief/dist/color-thief.min.js',
      'vendor/jquery-plugins/jquery-collagePlus/jquery.collagePlus.js',
      'vendor/jquery-plugins/jquery-collagePlus/extras/jquery.removeWhitespace.js',
      'vendor/hammerjs/hammer.min.js',
      //'vendor/moment/moment.js',
      //'vendor/angular-moment/angular-moment.js',
      //'vendor/hammer-touchemulator/touch-emulator.js',
      'vendor/d3/d3.min.js',
      //'vendor/nvd3/nv.d3.js',
      //'vendor/angular-nvd3/dist/angular-nvd3.js',
      'vendor/blueimp-load-image/js/load-image.all.min.js',
      'vendor/blueimp-canvas-to-blob/js/canvas-to-blob.min.js',
      'vendor/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
      'vendor/blueimp-file-upload/js/jquery.iframe-transport.js',
      'vendor/blueimp-file-upload/js/jquery.fileupload.js',
      'vendor/blueimp-file-upload/js/jquery.fileupload-process.js',
      'vendor/blueimp-file-upload/js/jquery.fileupload-image.js',
      'vendor/blueimp-file-upload/js/jquery.fileupload-validate.js',
      'vendor/jquery-ui/jquery-ui.min.js',
      'vendor/Jcrop/js/jquery.Jcrop.js',
      'vendor/ui-rect-select/dist/ui-rect-select.min.js',
      'node_modules/leaflet-image/leaflet-image.js',
      'vendor/leaflet-draw/dist/leaflet.draw.js'
    ],
    css: [
      'vendor/angular-material/angular-material.css',
      'vendor/leaflet/dist/leaflet.css',
      'vendor/Leaflet.markercluster/dist/MarkerCluster.css',
      'vendor/Leaflet.markercluster/dist/MarkerCluster.Default.css',
      'vendor/leaflet.elevation/dist/Leaflet.Elevation-0.0.2.css',
      'vendor/leaflet.locatecontrol/dist/L.Control.Locate.min.css',
      'vendor/Jcrop/css/jquery.Jcrop.min.css',
      'vendor/fontawesome/css/font-awesome.min.css',
      'vendor/ui-rect-select/dist/ui-rect-select.min.css',
      'vendor/leaflet-draw/dist/leaflet.draw.css'
      //'vendor/nvd3/nv.d3.css',
      //'http://cloud.github.com/downloads/lafeber/world-flags-sprite/flags32.css'
    ],
    assets: [
      'vendor/leaflet/dist/images/layers.png',
      'vendor/leaflet/dist/images/layers-2x.png',
      'vendor/leaflet/dist/images/marker-icon.png',
      'vendor/leaflet/dist/images/marker-icon-2x.png',
      'vendor/leaflet/dist/images/marker-shadow.png',
      'vendor/fontawesome/fonts/FontAwesome.otf',
      'vendor/fontawesome/fonts/fontAwesome-webfont.eot',
      'vendor/fontawesome/fonts/fontAwesome-webfont.svg',
      'vendor/fontawesome/fonts/fontAwesome-webfont.ttf',
      'vendor/fontawesome/fonts/fontAwesome-webfont.woff',
      'vendor/fontawesome/fonts/fontAwesome-webfont.woff2'
    ]
  }
};
