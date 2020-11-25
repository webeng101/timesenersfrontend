export default {
  data: {
    timer: null,
    currentTime: null,
    blowSteps: null,
    paused: true,
    ctx: null,
    blowImage: null,
    itemSize: null
  },

  setBlow (ctx, blowImage, blowSteps, itemSize) {
    this.paused = true
    this.ctx = ctx
    this.blowSteps = parseInt(blowSteps)
    this.currentTime = parseFloat(0)
    this.blowImage = blowImage
    this.itemSize = itemSize
  },

  play () {
    this.paused = false
    this.timer = setInterval(this.incrementGameTime.bind(this), 50)
  },

  pause () {
    this.paused = true
  },

  incrementGameTime () {
    // console.log('good time to show logo: ' + this.currentTime)
    if (this.paused) return
    // Show the animation
    this.animate(this.blowSteps - this.currentTime - 1)
    // Increment the time of the game
    this.currentTime = this.currentTime + 1 // (parseFloat(this.currentTime) + 0.1) // .toFixed(1)
    if (this.currentTime >= this.blowSteps) {
      this.currentTime = this.blowSteps
      this.finish()
    }
  },

  animate (iterationNumber) {
    const animateSize = this.blowImage.height() / 4
    const sy = iterationNumber * animateSize
    this.ctx.drawImage(this.blowImage[0], 0, sy, this.blowImage.width(), animateSize, 0, 0, this.itemSize, this.itemSize)
  },

  finish () {
    this.paused = true
    clearInterval(this.timer)
    this.ctx.clearRect(0, 0, this.itemSize, this.itemSize)
  }
}
