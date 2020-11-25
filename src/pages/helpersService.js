export default {
  data: {
    sign_wrong: 'asdfasdf',
    gameType: null
  },

  computeLocations (media, logoSize, left, top) {
    var leftPosition = left * media.width() / 100 - 0.5 * logoSize
    var topPosition = top * media.height() / 100 - 0.5 * logoSize
    var correctLocation = true
    if (leftPosition < 0 || topPosition < 0 || leftPosition + logoSize > media.width() || topPosition + logoSize > media.height()) {
      correctLocation = false
      if (leftPosition < 0) leftPosition = 0
      if (leftPosition + logoSize > media.width()) leftPosition = media.width() - logoSize
      if (topPosition < 0) topPosition = 0
      if (topPosition + logoSize > media.height()) topPosition = media.height() - logoSize
    }

    var obj = {
      leftPosition: leftPosition,
      topPosition: topPosition,
      correctLocation: correctLocation
    }

    return obj
  },

  computeItemSize (media, logoSize) {
    return parseInt(media.width() * logoSize / 100)
  }

}
