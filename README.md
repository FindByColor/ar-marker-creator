![Find By Color Logo](https://findbycolor-github.s3.amazonaws.com/logo.png "Find By Color Logo Logo")

AR Marker Creator
===

> Converts our Calibration Card into a custom Marker for AR Toolkit

Install
---

```bash
# Use the correct version of node
nvm use

# Install the dependencies
npm install
```

Usage
---

This script will convert our [Color Calibration Card](fbc-card.jpg) into an [AR Toolkit Marker](https://github.com/AR-js-org/AR.js/tree/master) so it can be detected by a camera in AR Web Applications.

```bash
# This will run `node index.js`
npm start
```

> ℹ️ After creating new marker files, make sure to copy the following files over to our [Color Calibration Camera](https://github.com/FindByColor/color-calibration-camera) repo.

* [marker/fbc-card.fset](marker/fbc-card.fset)
* [marker/fbc-card.fset3](marker/fbc-card.fset3)
* [marker/fbc-card.iset](marker/fbc-card.iset)
