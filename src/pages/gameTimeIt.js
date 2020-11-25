export default {
  data: {
    gameName: 'Time it',
    welcomeMessage: 'Remember time of the frames',
    timePlaceholder: null,
    dismissNotification: null
  },

  setTimePlaceholder (timePlaceholder) {
    this.timePlaceholder = timePlaceholder
  },

  showTime () {
    this.timePlaceholder.show()
  },

  hideTime () {
    if (this.timePlaceholder) this.timePlaceholder.hide()
  },

  updateTime (currentTime) {
    this.timePlaceholder.text(parseInt(currentTime))
  },

  showQuestion (q, appearances, maxScreenshotsNumber, showCorrectSign, showMissedSign, loadNextGame, currentScreenshot, media) {
    // Check for game over
    if (currentScreenshot > maxScreenshotsNumber) {
      this.timePlaceholder.text('')
      loadNextGame()
      return
    }
    var duration = media.duration
    media.currentTime = parseFloat(appearances[currentScreenshot].startTime)
    const answerOptions = this.generateAnswers(duration, appearances[currentScreenshot].startTime)
    this.dismissNotification = q.notify({
      message: 'Do you remember when was this screenshot taken?',
      position: 'top',
      actions: [
        { label: answerOptions[0].frame, color: 'black', handler: () => { if (answerOptions[0].isCorrect) showCorrectSign(); else showMissedSign(); this.showQuestion(q, appearances, maxScreenshotsNumber, showCorrectSign, showMissedSign, loadNextGame, currentScreenshot + 1, media) } },
        { label: answerOptions[1].frame, color: 'black', handler: () => { if (answerOptions[1].isCorrect) showCorrectSign(); else showMissedSign(); this.showQuestion(q, appearances, maxScreenshotsNumber, showCorrectSign, showMissedSign, loadNextGame, currentScreenshot + 1, media) } },
        { label: answerOptions[2].frame, color: 'black', handler: () => { if (answerOptions[2].isCorrect) showCorrectSign(); else showMissedSign(); this.showQuestion(q, appearances, maxScreenshotsNumber, showCorrectSign, showMissedSign, loadNextGame, currentScreenshot + 1, media) } },
        { label: answerOptions[3].frame, color: 'black', handler: () => { if (answerOptions[3].isCorrect) showCorrectSign(); else showMissedSign(); this.showQuestion(q, appearances, maxScreenshotsNumber, showCorrectSign, showMissedSign, loadNextGame, currentScreenshot + 1, media) } }
        // { icon: 'close', color: 'primary' }
      ],
      color: 'white',
      textColor: 'black',
      timeout: 0,
      html: true
    })
  },

  generateAnswers (duration, startTime) {
    var answerOptions = []
    // add answer 1
    var val = { frame: parseInt(startTime), isCorrect: true }
    answerOptions.push(val)
    // add answer 2
    var randomFrame = val.frame
    do {
      randomFrame = Math.floor(Math.random() * duration)
    } while (randomFrame === answerOptions[0].frame)
    answerOptions.push({ frame: randomFrame, isCorrect: false })
    // add answer 2
    do {
      randomFrame = Math.floor(Math.random() * duration)
    } while (randomFrame === answerOptions[0].frame || randomFrame === answerOptions[1].frame)
    answerOptions.push({ frame: randomFrame, isCorrect: false })
    // add answer 3
    do {
      randomFrame = Math.floor(Math.random() * duration)
    } while (randomFrame === answerOptions[0].frame || randomFrame === answerOptions[1].frame || randomFrame === answerOptions[2].frame)
    answerOptions.push({ frame: randomFrame, isCorrect: false })
    // shuffle the places of answers
    this.shuffle(answerOptions)
    return answerOptions
  },

  shuffle (array) {
    var currentIndex = array.length, temporaryValue, randomIndex
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }
}
