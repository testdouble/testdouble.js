module.exports = {
  nodeVersionLessThan: function (majorVersion) {
    return parseInt(process.version.match(/v(\d+)/)[1], 10) < majorVersion
  }
}
