# The `src/app/maps/track` Directory

## Overview

```
src/
  |- app/
  |  |- home/
  |  |- about/
  |  |- maps/
  |  |  |- track/
  |  |  |  |- my/
  |  |  |  |- search/
  |  |  |  |- upload/
  |  |  |  |- track.ctl.js
  |  |  |  |- track.tpl.html
```

The `src/app` directory contains all track specific to this application. 

## `track.ctl.js`


### Testing

One of the design philosophies of `ngBoilerplate` is that tests should exist
alongside the code they test and that the build system should be smart enough to
know the difference and react accordingly. As such, the unit test for `track.ctl.js`
is `track.spec.js`, though it is quite minimal.
