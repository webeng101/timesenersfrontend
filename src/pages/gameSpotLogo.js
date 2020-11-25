// import { BaseGame } from './helpersService'
// const baseGame = new BaseGame()

export default {
  // ...baseGame,

  data: {
    gameName: 'Spot the logo',
    welcomeMessage: 'Hit the item when you see it in the clip'
  },

  drawImage (canvas, logo, logoSize) {
    canvas[0].width = logo.width()
    canvas[0].height = logo.height()
    var ctx = canvas[0].getContext('2d')
    ctx.drawImage(logo[0], 0, 0)
    // canvas.height(logoSize)
    canvas.width(logoSize)
  }
}
