# Quirks I found so far:

## All Browsers
- [ ] Currently needs a server because of usage `script type="module"` - CORS


# Browser Specific:

## Firefox:
- [x] There is no `ctx.roundRect()` function - can be fixed by manualy creating this function (fixed in firefox version 112)

## Firefox Nightly:
### So far no problems found

## Chromium and family
- [ ] Setting video `currentTime` var resets the playback
