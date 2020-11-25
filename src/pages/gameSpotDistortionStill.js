import * as PIXI from 'pixi.js'

export default {
  data: {
    gameName: 'Spot distortion still image',
    welcomeMessage: 'Hit the distortion when you see it on image',
    isRunning: false,
    firstRun: true,
    ticker: null,
    texture: null,
    baseTexture: null,
    stage: null,
    renderer: null,
    displacementSprite: null
  },

  init () {
    this.isRunning = false
    this.firstRun = true
    const app = new PIXI.Application()
    console.log('Pixi initiated: ' + app)
    app.destroy(true)
    this.displacementSprite = PIXI.Sprite.from('/images/cloud1.jpg')
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
  },

  stopDrawing () {
    this.isRunning = false
  },

  destroy () {
    if (this.ticker) {
      this.ticker.stop()
    }
    this.firstRun = true
    this.isRunning = false
    // var stageOptions stageOptions.children = true stageOptions.texture = true stageOptions.baseTexture = true
    // if (stage) stage.removeChildren()
    // this.baseTexture.destroy()
  },

  drawStripeDistortion (canvas, media, logoSize, sx, sy, ratio, distortionSpeed) {
    canvas.width = logoSize
    canvas.height = logoSize
    var ctx = canvas.getContext('2d')
    // ctx.drawImage(media,0,0)
    // ctx.drawImage(media, 0, 0, logoSize, logoSize)
    // ctx.drawImage(media, sx, sy, logoSize, logoSize, 0, 0, logoSize, logoSize)
    ctx.drawImage(media, sx / ratio, sy / ratio, logoSize / ratio, logoSize / ratio, 0, 0, logoSize, logoSize)
    ctx.globalCompositeOperation = 'difference'
    const horizontalCells = 1, verticalCells = 50, hCellSize = Math.ceil(logoSize / horizontalCells), vCellSize = Math.ceil(logoSize / verticalCells)
    for (var i = 0; i < horizontalCells; i += 10) {
      for (var j = 0; j < verticalCells; j += 1) {
        if (Math.random() < 0.5) continue // ctx.fillStyle = 'red'
        else ctx.fillStyle = 'white'
        ctx.fillRect(i * hCellSize, j * vCellSize, hCellSize, vCellSize)
      }
    }
    ctx.globalCompositeOperation = 'difference'
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, logoSize, logoSize)
    this.isRunning = true
  },

  drawLiquidDistortion (canvas, media, logoSize, sx, sy, ratio, distortionSpeed) {
    if (logoSize === 0 || this.isRunning) return
    console.log('gsd: logosize is: ' + logoSize + ', startX = ' + sx + ', startY' + sy + ', firstRun = ' + this.firstRun)
    this.displacementSprite.scale.x = 25 / distortionSpeed
    this.displacementSprite.scale.y = 25 / distortionSpeed
    const resolution = parseFloat(media.videoWidth / media.offsetWidth)

    if (!this.firstRun) {
      this.renderer.resize(logoSize, logoSize)
      if (resolution) {
        this.baseTexture.setResolution(resolution)
        this.baseTexture.update()
      }
      this.texture.frame = new PIXI.Rectangle(sx, sy, logoSize, logoSize)
      this.texture.updateUvs()
      this.isRunning = true
      return
    }

    this.renderer = new PIXI.Renderer({
      view: canvas,
      width: logoSize,
      height: logoSize,
      autoDensity: false
    })

    this.stage = new PIXI.Container()
    this.stage.addChild(this.displacementSprite)

    const displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
    displacementFilter.autoFit = false
    this.stage.filters = [displacementFilter]

    if (resolution) this.baseTexture = new PIXI.BaseTexture(media, { resolution: resolution })
    else this.baseTexture = new PIXI.BaseTexture(media)
    this.texture = new PIXI.Texture(this.baseTexture, new PIXI.Rectangle(sx, sy, logoSize, logoSize))
    const imageSprite = PIXI.Sprite.from(this.texture)
    this.stage.addChild(imageSprite)

    this.ticker = new PIXI.Ticker()
    const animate = () => {
      this.displacementSprite.x += 2
      this.displacementSprite.y += 2
      this.renderer.render(this.stage)
    }
    this.ticker.add(animate)
    this.ticker.start()
    this.isRunning = true
    this.firstRun = false
  }
}
