var showLogoOnTime, callCheckGameOver

export default {
  data: {
    timer: null,
    currentTime: null,
    duration: null,
    paused: true
  },

  setMethods (newShowLogoOnTime, newCallCheckGameOver) {
    showLogoOnTime = newShowLogoOnTime
    callCheckGameOver = newCallCheckGameOver
  },

  setGameDuration (gameDuration) {
    this.duration = parseFloat(gameDuration)
    this.currentTime = parseFloat(0)
  },

  play () {
    this.paused = false
    this.timer = setInterval(this.incrementGameTime.bind(this), 100)
  },

  pause () {
    this.paused = true
  },

  incrementGameTime () {
    // console.log('good time to show logo: ' + this.currentTime)
    if (this.paused) return
    // Increment the time of the game
    this.currentTime = (parseFloat(this.currentTime) + 0.1) // .toFixed(1)
    if (this.currentTime > this.duration) {
      this.currentTime = this.duration
      this.finish()
      return
    }
    showLogoOnTime()
    // @timeupdate="showLogoOnTime"
  },

  finish () {
    this.paused = true
    clearInterval(this.timer)
    callCheckGameOver()
    // @ended="callCheckGameOver"
  }
}
