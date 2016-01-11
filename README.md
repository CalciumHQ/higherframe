# Higherframe Web

## Requirements
`gem install susy && gem install breakpoint`
`brew install graphicsmagick`

Possibly also
`brew install cairo`

Paper requests `jsdom` version greater than 3.1.2, however new versions of `jsdom@4.0.0` requires Node 3.0+. `jsdom` version 3.1.2 should be enforced.

## Issues
`node-canvas` has issues installing on OSX, [https://github.com/Automattic/node-canvas/issues/630](see this issue). A workaround is to `npm install paper` before any other modules, then do `npm install`.
