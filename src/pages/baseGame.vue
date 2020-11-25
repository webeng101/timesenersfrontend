<template>
  <q-page padding>
    <div id='video-container'>
        <!-- If we have still image -->
        <img v-if="gameType.includes('still')"
        id='myMedia'
        @click="videoClicked">
        <!-- If we have video -->
        <video v-else
        id='myMedia'
        @timeupdate="showLogoOnTime"
        @ended="callCheckGameOver"
        @click="videoClicked"
        ref="myMedia"
        playsinline></video>
        <!--muted-->
        <div v-if="gameType.includes('spot')" id='canvas-wrapper'>
          <img id='imageOverlay' @click='startGame()'  alt='' src='~assets/pixel_black.png'>
          <img id='blowImage' alt='Powwww!' src='~assets/blow1.png' hidden>
          <img id='touchImage' alt='Touch size' src='~assets/sign_touch.png' hidden>
          <canvas id='myCanvas'></canvas>
          <canvas id='animationCanvas'></canvas>
        </div>
        <!-- If we logo in our game -->
        <span v-show="gameType === 'timeit'" id='timePlaceholder' hidden></span>
        <img v-if="gameType.includes('logo')" id='logoImage' hidden>
        <span id='welcomeMessage'>Loading...</span>
        <button @click='startGame()' id='startPlaying' type='button'>Loading...</button>
        <img @click='hidePublisherPanel(false)' id='gameSettingsLogo' alt='Game settings' src='~assets/settings.png' hidden>
        <img id='loadingImage' alt='Loading...' src='~assets/loading 1.gif'>
    </div>

    <div id='publisherPanelParams'>
      <label>Complexity level: {{ complexity }} % </label>&nbsp;
      <input id="complexityProgressBar" v-model="complexity" type="range" :min="1" :max="100" @change="setComplexityLevel()" class='slider' disabled>
      <br><br>
      <span>Number of appearances: {{ maxScreenshotsNumber }}</span>&nbsp;&nbsp;
      <input type="range" v-model="maxScreenshotsNumber" :min="1" :max="totalNumberOfAppearances" @change="updateNumberOfScreenshots()" class='slider'>
      <br><br>
      <div v-if="gameType !== 'timeit'">
        <label v-if="gameType === 'stopit'">Average time tolerance for answer (sec): </label>
        <label v-else>Average time to react (sec): </label>
        &nbsp;
        <input type='range' v-model="averageTimeToReact" id='averageToleranceTime' :min='minAverageTimeToReact' :max='maxAverageTimeToReact' :step='0.1' @change="updateAverageTimeToReact()" class='slider'>&nbsp;<span>{{ averageTimeToReact }}</span>
        <br><br>
      </div>
      <label>Edit appearance: </label> &nbsp;
      <q-btn-toggle class="appearanceNavigationButtons" v-model="model" toggle-color="primary" @click="updateScreenshootAppearanceParams()" :options="updateScreenshotAppearanceObjects"></q-btn-toggle>
      <br><br>
      <div id = 'screenshotParams' v-show="activeAppearance !== 0">
        <label for='startTime'>Start time (sec):</label> &nbsp;
        <input readonly type='number' step='0.1' id='startTime' name='startTime'><br><br>
        <div v-if="gameType.includes('spot')">
          <label for='startX'>Logo position X:</label>&nbsp;
          <input type='number' id='startX' name='startX' min='5' max='95' @change="updateAppearanceWithParams()">&nbsp;
          <label for='startY'>Y:</label> &nbsp;
          <input type='number' id='startY' name='startY' min='5' max='95' @change="updateAppearanceWithParams()"><br>
          <br>
        </div>
      </div>
      <div v-if="gameType.includes('spotlogo')">
        <label>Choose your logo</label> &nbsp;
        <br>
        <img alt='Emoji' src='images/emoji 1.png' @click="emojiClicked(1)" height="59" class='emojiImage'> &nbsp;
        <img alt='Emoji' src='images/emoji 2.png' @click="emojiClicked(2)" height="59" class='emojiImage'> &nbsp;
        <img alt='Emoji' src='images/emoji 3.png' @click="emojiClicked(3)" height="59" class='emojiImage'> &nbsp;
        <img alt='Emoji' src='images/emoji 4.png' @click="emojiClicked(4)" height="59" class='emojiImage'> &nbsp;
        <img alt='Emoji' src='images/emoji 5.png' @click="emojiClicked(5)" height="59" class='emojiImage'> &nbsp;
        <img alt='Emoji' src='images/emoji 6.png' @click="emojiClicked(6)" height="59" class='emojiImage'> &nbsp;
        <img alt='Emoji' src='images/emoji 7.png' @click="emojiClicked(7)" height="59" class='emojiImage'> &nbsp;
        <br><br>
      </div>
      <div v-if="gameType.includes('spotdistortion')">
        <label>Choose the distortion effect and speed:  {{ distortionSpeed }}</label> &nbsp;
        <input
          type='range'
          v-model='distortionSpeed'
          :min='10'
          :max='100'
          @change="updateLogoSize()"
          class='slider'>
        <br><br>
        <img alt='Distortion type' src='~assets/distortion 1.gif' height="99"> &nbsp;
        <img alt='Distortion type' src='~assets/distortion 2.gif' height="99"> &nbsp;
        <br><br>
      </div>
      <div v-if="gameType.includes('spot')">
        <label>Logo width (% of video width): {{ logoSize }}</label> &nbsp;
        <input
          type='range'
          v-model='logoSize'
          :min='minLogoSize'
          :max='maxLogoSize'
          @change="updateLogoSize()"
          class='slider'>
        <br><br>
        <label @click="showTouch()">Allowed touch size radius (%): {{ touchSize }}</label> &nbsp;
        <input
          type='range'
          v-model='touchSize'
          :min='logoSize'
          :max='maxLogoSize + 1'
          @change="updateTouchSize()"
          class='slider'>
        <br><br>
      </div>
      <!-- https://3.129.243.241:8443//tsb//uploadImage -->
      <!-- http://localhost:8080//uploadImage -->
      <form v-if="gameType === 'spotlogo'" id="imageUploadForm" method="POST" action="https://3.129.243.241:8443//uploadImage" enctype="multipart/form-data">
        <label>Upload your logo:</label> &nbsp;
        <input v-model="logoImagePath" type='text' id='logoImagePath'  disabled> &nbsp;
        <input id="newLogoImagePath" type="file" name="file" accept="image/x-png, image/jpeg"/>
        <input id="uploadNewImageButton"  type="submit" name="upload" value="Upload Logo"/>
        <br><br>
      </form>
      <div v-if="gameType === 'spotlogostill' || gameType === 'spotdistortionstill'">
        <label>Upload still image</label> &nbsp;
        <input v-model="stillImagePath" type='text' id='stillImagePath' disabled> &nbsp;
        <input type='file' id='newStillImagePath' accept='image/*'>
        <br><br>
        <label>Game duration (sec):</label> &nbsp;
        <input v-model="gameDuration" type='number' @change="updateGameDuration()"> &nbsp;
        <br><br>
      </div>
      <div v-else>
        <!-- https://3.129.243.241:8443//tsb//uploadVideo -->
        <!-- http://localhost:8080//uploadVideo -->
        <form v-if="gameType === 'spotlogo'" id="videoUploadForm" method="POST" action="https://3.129.243.241:8443//uploadVideo" enctype="multipart/form-data">
          <label for='videoPath'>Clip:</label> &nbsp;
          <input type='text' id='videoPath' name='videoPath' disabled> &nbsp;
          <input id="newVideoPath" type="file" name="file" accept="video/*"/>
          <input id="uploadNewVideoButton" type="submit" name="upload" value="Upload Video"/>
          <br>
        </form>
      </div>
      <q-checkbox v-if="gameType === 'stopit'" label="Show answer after each screenshot" color="primary" v-model="showAnswerAfterEachScreenshot"/>
      <br><br>
      <!-- button @click='setPublisherPanelParams(); hidePublisherPanel(true)' type='button'>Player mode</button -->
      <button @click='setParamsFromPublisherPanel()' type='button'>Play with these params</button> &nbsp;
      <button v-if="gameType === 'spotlogo'" @click='createGame()' id='createGameButton' type='button' disabled>Create game</button> &nbsp;
    </div>

    <div id='advancedPublisherPanelParams' hidden>
      <br><br>
      <p>Advanced params</p>
      <span>Total number of appearances: {{ totalNumberOfAppearances }} </span>&nbsp;&nbsp;
      <input type="range" min="1" max="20" value="totalNumberOfAppearances" class='slider' disabled>
      <br><br>
      <label for='startTime'>Start time : editable slider</label> &nbsp;
      <br><br>
    </div>
  </q-page>
</template>

<script>
var $ = require('jquery')
import enableInlineVideo from 'iphone-inline-video'
import helpersService from './helpersService'
import gameServices from './gameServices'

// Load and set initial variables of the game, in the case backend is switched off
var videoPath, resultCopy
var appearances = [] // startTime, toleranceTime, startX, startY, answer, answered
var vid, currentTime = 0

// Common code
export default {
  data () {
    return {
      // form: {}
      playerMode: false,
      gameType: 'spotlogo',
      complexity: null,
      activeAppearance: 0,
      model: null,
      maxScreenshotsNumber: null,
      totalNumberOfAppearances: null,
      averageTimeToReact: 1.8,
      minAverageTimeToReact: 0.2,
      maxAverageTimeToReact: 1.8,
      logoImagePath: null,
      stillImagePath: null,
      gameDuration: null,
      logoSize: null,
      touchSize: null,
      minLogoSize: 5,
      maxLogoSize: 50,
      distortionSpeed: null,
      distortionType: null,
      updateScreenshotAppearanceObjects: [
        // { label: '1', value: '1' }, ...
      ],
      fixedStartX: 50,
      fixedStartY: 50,
      startPlayingButtonText: 'Start playing',
      showNextText: 'Show next',
      continuePlayingButtonText: 'Continue playing',
      showAnswerAfterEachScreenshot: true
    }
  },

  computed: {
  },

  methods: {
    showCorrectSign (timeMatches) {
      var things = ['Awesome!', 'Good job', 'Weel done.', 'Super!', 'You are very good at that', 'Beautiful', 'Terrific!', 'Fantastic!', 'I like that.']
      var correctMessage = things[Math.floor(Math.random() * things.length)]
      if (timeMatches) correctMessage += ' Reacted in ' + timeMatches.toFixed(2) + ' sec'
      this.$q.notify({
        color: 'gray',
        message: correctMessage,
        position: 'bottom',
        avatar: gameServices.data.sign_correct,
        timeout: 700
      })
    },

    showMissedSign () {
      var things = ['Missed it', 'Nope', 'Try again', 'Almost correct']
      var missedMessage = things[Math.floor(Math.random() * things.length)]
      this.$q.notify({
        color: 'gray',
        message: missedMessage,
        position: 'bottom',
        avatar: gameServices.data.sign_wrong,
        timeout: 700
      })
    },

    showWarningMessage (mesage) {
      this.$q.notify({
        message: mesage,
        position: 'top-right',
        type: 'warning',
        timeout: 700
      })
    },

    hideWelcomeScreen (hide) {
      if (hide) {
        $('#imageOverlay').hide()
        $('#welcomeMessage').hide()
        $('#startPlaying').hide()
        gameServices.stopDrawing()
        $('#gameSettingsLogo').hide()
      } else {
        $('#imageOverlay').show()
        $('#welcomeMessage').show()
        $('#startPlaying').show()
        this.showLogo(50, 50)
        if ($('#publisherPanelParams').is(':hidden')) $('#gameSettingsLogo').show()
      }
      this.hideScreenshotOptions()
    },

    hideScreenshotOptions () {
      this.activeAppearance = 0
      this.model = this.activeAppearance
      $('#touchImage').hide()
    },

    hidePublisherPanel (hide) {
      // Added publisher panel state checking because of resize, there are hundreds of calls and browser freezes for so many computations, so condition
      if (hide) {
        $('#publisherPanelParams').hide()
        if (gameServices.paused()) $('#gameSettingsLogo').show()
        $('#leftDrawer').hide()
        $('#layoutHeader').hide()
        // console.log($('.q-page-container').css('padding'))
        $('.q-page-container').css('padding-top', '0px')
        $('.q-layout-padding').css('padding', '0px')
        $('.q-page-container').css('background-color', 'black')
        $('#video-container').css('max-height', window.innerHeight)
        if (gameServices.paused()) this.showLogo(this.fixedStartX, this.fixedStartY)
      } else {
        $('#publisherPanelParams').show()
        $('#gameSettingsLogo').hide()
        $('#leftDrawer').show()
        $('#layoutHeader').show()
        $('.q-page-container').css('padding-top', '50px')
        // $('.q-page-container').css('padding-left', '300px')
        $('.q-layout-padding').css('padding', '16px')
        $('.q-page-container').css('background-color', 'white')
        $('#video-container').css('max-height', '')
        if (gameServices.paused()) this.showLogo(this.fixedStartX, this.fixedStartY)
      }
    },

    setRandomScreenshots () {
      appearances = []
      for (var i = 1; i <= this.maxScreenshotsNumber; i++) {
        this.setRandomScreenshot(i)
      }
    },

    setRandomScreenshot (screenshotNumber) {
      console.log('setRandomScreenshot >> screenshot number is : ' + screenshotNumber)
      var randomStart, anyMatches
      do {
        anyMatches = false
        var random = Math.floor((Math.random() * this.totalNumberOfAppearances))
        randomStart = resultCopy.appearances[random].startTime

        for (var i = 1; i <= this.maxScreenshotsNumber; i++) {
          if (!appearances[i] || !appearances[i].startTime) continue
          if (randomStart === appearances[i].startTime) anyMatches = true
        }
      } while (anyMatches)
      appearances[screenshotNumber] = {
        startTime: randomStart,
        toleranceTime: parseFloat(resultCopy.appearances[random].toleranceTime),
        startX: resultCopy.appearances[random].startX,
        startY: resultCopy.appearances[random].startY
      }
      appearances.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)
      if (appearances[0].startTime) appearances.splice(0, 0, 'undefined') // because we start from 1, not 0
    },

    // Set parameters from admin panel
    setParamsFromPublisherPanel () {
      // Reset the playable media
      gameServices.pause()
      currentTime = 0
      gameServices.setCurrentTime(0)
      // Show welcome screen with a welcome message
      this.hideWelcomeScreen(false)
      $('#startPlaying').text(this.startPlayingButtonText)
      // Reset answer and answered global variables
      for (var k = 1; k <= this.maxScreenshotsNumber; k++) {
        appearances[k].answer = false
        appearances[k].answered = false
      }
      window.scrollTo(0, 0)
    },

    // Load the game parameters from server via ajax request
    loadGame () {
      var gameID = ''
      console.log('route is : ' + this.$route.name)
      switch (this.$route.name) {
        case 'playermode':
          this.playerMode = true
          this.hidePublisherPanel(true)
          break
        case 'creategamepage':
          gameID = this.$route.params.gameType + '0'
          break
        case 'gamepage':
          gameID = this.$route.params.gameId
          break
      }
      console.log('gameID is : ' + gameID)
      $.ajax({
        type: 'GET',
        async: false,
        url: 'https://3.129.243.241:8443/getgame?gameID=' + gameID + '&password=' + window.storage.password,
        // url: 'http://localhost:8080/getgame?gameID=' + gameID + '&password=' + window.storage.password,
        // test via browser >> https://3.129.243.241:8443/tsb/getgame?gameID=spotlogo0
        // test via browser >> http://localhost:8080/getgame?gameID=spotlogo0
        success: function (result) {
          console.log(result)
          if (result.gameType) {
            resultCopy = result
            this.gameType = result.gameType
            this.maxScreenshotsNumber = parseInt(result.maxScreenshotsNumber)
            this.totalNumberOfAppearances = parseInt(result.appearances.length) // result.totalNumberOfAppearances
            this.logoImagePath = result.logoImagePath
            this.logoSize = parseInt(result.logoSize)
            this.touchSize = result.touchSize
            // if (this.gameType.includes('distortion')) {...
            this.distortionSpeed = parseInt(result.distortionSpeed) // 50
            this.distortionType = result.distortionType
            // if (this.gameType.includes('still')) {...
            this.stillImagePath = result.stillImagePath // 'images/still_image.png'
            this.gameDuration = parseInt(result.gameDuration) // 22
          } else {
            // this.showWarningMessage('The game is of wrong format or game ID is incorrect.')
            this.showWarningMessage('Your password is wrong or expired! Please contact tigran@gmail.com.')
            this.gameType = null
          }
        }.bind(this),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown)
          this.showWarningMessage('Server sent an error! Could not connect to backend, loading default data!')
        }.bind(this),
        complete: function (data) {
        }
      })
    },

    setGame () {
      console.log('setGame(): gameType is : ' + this.gameType)
      gameServices.setGame(this.gameType, $('#toolbarTitle'), $('#welcomeMessage'), $('#timePlaceholder'), this.showLogoOnTime, this.callCheckGameOver, vid, $('#myCanvas'), $('#animationCanvas'))
      this.setRandomScreenshots()
      if (this.gameType.includes('still')) {
        gameServices.setGameDuration(this.gameDuration)
        this.hideWelcomeScreen(false)
      } else {
        // Load the whole video content
        videoPath = resultCopy.videoPath // videoPath = 'videos/Amir Khan vs A Bottle.mp4'
        var req = new XMLHttpRequest()
        req.open('GET', videoPath, true)
        req.responseType = 'blob'
        req.onload = () => {
          // Onload is triggered even on 404 so we need to check the status code
          // Preload video
          if (req.status === 200) {
            var videoBlob = req.response
            // Video is now downloaded and we can set it as source on the video element
            vid.src = URL.createObjectURL(videoBlob)
            enableInlineVideo(vid)
            // Hide loading animation.
            $('#loadingImage').hide()
            // Required Only for iOS iPhone
            if (this.$q.platform.is.ios) {
              gameServices.play()
              vid.addEventListener('playing', (event) => {
                // Check if we are in welcome screen, otherwise it will not play the video at all
                if ($('#startPlaying').is(':visible')) {
                  this.showLogo(50, 50)
                  gameServices.pause()
                }
              })
              vid.addEventListener('error', () => {
                console.error(`Error loading: ${vid}`)
              })
            }
          }
        }
        req.onerror = function () {
          // Error
        }
        req.send()
      }
      this.setParamsFromPublisherPanel()
      // Set image and video, if is not in upload mode
      if (this.gameType.includes('logo')) {
        $('#logoImage').on('load', function () { this.showLogo(50, 50) }.bind(this))
        $('#logoImage').attr('src', this.logoImagePath)
        this.updateSource($('#newLogoImagePath'), $('#logoImage'))
      }
      if (this.gameType.includes('still')) {
        $('#myMedia').on('load', function () { this.showLogo(50, 50); $('#loadingImage').hide() }.bind(this))
        $('#myMedia').attr('src', this.stillImagePath)
        this.updateSource($('#newStillImagePath'), $('#myMedia')) // set the new still image background
      } else {
        // set the new video background
        this.updateSource($('#newVideoPath'), $('#myMedia'))
      }
      this.updateScreenshotButtons()
      this.setPublisherPanelParams()
    },

    startGame () {
      // Check if new 'Stop it' game is started, then show first screenshot and return without playing
      if (this.gameType === 'stopit' && gameServices.getCurrentTime().toFixed(1) !== appearances[this.maxScreenshotsNumber].startTime.toFixed(1) && currentTime < 1) {
        var startButtonText = 'Loading...'
        var appearanceNumber = 1
        startButtonText = this.showNextText

        if (this.maxScreenshotsNumber === 1 || gameServices.getCurrentTime().toFixed(1) === appearances[this.maxScreenshotsNumber - 1].startTime.toFixed(1)) {
          startButtonText = this.startPlayingButtonText
          appearanceNumber = this.maxScreenshotsNumber
        } else {
          for (var i = 1; i < this.maxScreenshotsNumber; i++) {
            // console.log('checking some things: ' + gameServices.getCurrentTime() + ' vs ' + appearances[i].startTime)
            if (gameServices.getCurrentTime().toFixed(1) === appearances[i].startTime.toFixed(1)) {
              appearanceNumber = i + 1
              break
            }
          }
        }

        $('#startPlaying').text(startButtonText)
        currentTime = 0
        gameServices.setContinuePlayingMessage($('#welcomeMessage'))
        gameServices.setCurrentTime(appearances[appearanceNumber].startTime)
        return
      }

      // For other games
      this.hideWelcomeScreen(true)
      // Check if new game is started or this was continue...
      if ($('#startPlaying').text() === this.startPlayingButtonText) {
        currentTime = 0
      }
      // Just play from current time
      gameServices.setCurrentTime(currentTime)
      gameServices.play()
    },

    loadNextGame () {
      // this.showWarningMessage('Next game is loaded!')
      this.setParamsFromPublisherPanel()
      this.setRandomScreenshots()
      this.setAverageTimeToReact()
      this.updateAverageTimeToReact()
      // Go to the route of the next game generated randomly
    },

    showNextScreenshot () {
      if (this.gameType !== 'stopit' || !this.showAnswerAfterEachScreenshot) return
      currentTime = parseFloat(gameServices.getCurrentTime())
      var nextScreenshot = -1
      var firstScreenshot = -1
      for (var j = 1; j <= this.maxScreenshotsNumber; j++) {
        if (!appearances[j].answer) {
          if (firstScreenshot === -1) firstScreenshot = j
          if (!appearances[j].answered) nextScreenshot = j
        }

        if (nextScreenshot >= 0) {
          console.log('nextScreenshot = ' + nextScreenshot)
          console.log('appearances[nextScreenshot].startTime = ' + appearances[nextScreenshot].startTime)
          console.log('currentTime = ' + currentTime)
          if (appearances[nextScreenshot].startTime >= currentTime - appearances[nextScreenshot].toleranceTime) {
            console.log('chosen = ' + nextScreenshot)
            break
          }
        }
      }
      console.log('first = ' + firstScreenshot)
      console.log('next = ' + nextScreenshot)
      if (nextScreenshot === -1) {
        if (firstScreenshot === -1) return
        else nextScreenshot = firstScreenshot
      }

      console.log('final choice: ' + nextScreenshot)
      gameServices.pause()
      this.hideWelcomeScreen(false)
      gameServices.setCurrentTime(appearances[nextScreenshot].startTime)
      $('#startPlaying').text(this.continuePlayingButtonText)
    },

    showLogoOnTime () {
      if (gameServices.paused()) return

      // If the game is Time it just show the current frame number
      if (this.gameType === 'timeit') {
        gameServices.updateTime()
        return
      }

      // Check if it is a time to show the logo
      var i
      if (gameServices.timeMatches(appearances, this.maxScreenshotsNumber) > 0) {
        for (i = 1; i <= this.maxScreenshotsNumber; i++) {
          if (gameServices.timeMatches(appearances, this.maxScreenshotsNumber, i) > 0) {
            this.showLogo(appearances[i].startX, appearances[i].startY)
          }
        }
      } else {
        gameServices.stopDrawing()
      }
      // Should be outside of else, because image appearances may overlap
      // Check if the time of answering has passed
      for (i = 1; i <= this.maxScreenshotsNumber; i++) {
        if (!appearances[i].answer && !appearances[i].answered && gameServices.getCurrentTime() > (appearances[i].startTime + appearances[i].toleranceTime)) {
          appearances[i].answered = true
          this.showMissedSign()
          this.showNextScreenshot()
        }
      }
    },

    logoClicked () {
      console.log('logo clicked')
      // User has clicked at the startup imagegameServices.getCurrentTime()
      if (gameServices.paused() && gameServices.getCurrentTime() < 0.09) { //! important to set higher than 0, sometimes takes 0.00846 and === 0 does not function properly
        this.startGame()
        return
      }
      // Check if the publisher is just editing the appearances
      if (gameServices.paused()) {
        return
      }
      // Check which answer was this
      for (var i = 1; i <= this.maxScreenshotsNumber; i++) {
        var reactedTime = gameServices.timeMatches(appearances, this.maxScreenshotsNumber, i)
        if (reactedTime > 0) {
          appearances[i].answer = true
          appearances[i].answered = true
          this.showCorrectSign(reactedTime)
          this.showNextScreenshot()
          this.showBlow()
          return
        }
      }
    },

    videoClicked () {
      var mouseX = event.layerX
      var mouseY = event.layerY
      // check if game did not start yet, or is in publisher's mode
      if (gameServices.paused()) {
        // for stop it no matter where exactly was clicked
        if (this.gameType === 'stopit' || this.gameType === 'timeit') {
          this.startGame()
          // we do not have clickable item, so return
          return
        }
        // check if publisher has chosen for which appearance they want to set the location
        if (this.activeAppearance !== 0) {
          appearances[this.activeAppearance].startX = (mouseX * 100 / $('#myMedia').width()).toFixed(0)
          appearances[this.activeAppearance].startY = (mouseY * 100 / $('#myMedia').height()).toFixed(0)
          $('#startX').val(appearances[this.activeAppearance].startX)
          $('#startY').val(appearances[this.activeAppearance].startY)
          console.log('clicked at : ' + appearances[this.activeAppearance].startX + ', ' + appearances[this.activeAppearance].startY)
          this.showLogo(appearances[this.activeAppearance].startX, appearances[this.activeAppearance].startY)
        } else {
          this.showWarningMessage('Choose the appearance first')
        }
      } else {
        // no need to check appearance clicks during time it game
        if (this.gameType === 'timeit') return
      }

      if (gameServices.timeMatches(appearances, this.maxScreenshotsNumber) > 0) {
        // Check if the game is the "Stop it" them the click location does not matter
        if (this.gameType === 'stopit') {
          this.logoClicked()
          return
        }
        // Check if mobile then use touch size
        var itemSize = this.logoSize
        if (window.innerWidth < 1024) { itemSize = this.touchSize }
        var allowedDistance = $('#myMedia').width() * itemSize / 100
        var logoX = $('#myCanvas').position().left + $('#myCanvas').width() / 2
        var logoY = $('#myCanvas').position().top + $('#myCanvas').height() / 2
        var a = logoX - mouseX, b = logoY - mouseY
        var distance = Math.sqrt(a * a + b * b)
        if (distance < allowedDistance) {
          this.logoClicked()
          return
        }
      }
      if (!gameServices.paused()) {
        // was clicked at wrong place
        this.showMissedSign()
      }
    },

    // The video is over, so check if the Game is over too
    callCheckGameOver () {
      // Check if this was Time it game, and then if yes ask when each screenshot was taken
      if (this.gameType === 'timeit') {
        // hide the time placeholder
        gameServices.pause()
        gameServices.showTimeItQuestion(this.$q, appearances, this.maxScreenshotsNumber, this.showCorrectSign, this.showMissedSign, this.loadNextGame)
        return
      }
      this.loadNextGame()
    },

    showLogo (left, top) {
      if (!this.gameType.includes('spot') || $('#myMedia').height() < 1) return
      // console.log('show logo : ' + left + ' ' + top, $('#myMedia').width(), $('#myMedia').height())
      this.fixedStartX = left; this.fixedStartY = top
      const logoWidth = helpersService.computeItemSize($('#myMedia'), this.logoSize)
      var locations = helpersService.computeLocations($('#myMedia'), logoWidth, left, top)
      if (!locations.correctLocation && !$('#myCanvas').is(':visible') && gameServices.paused()) {
        this.showWarningMessage('The item position exceeds container boundaries, centering...')
      }

      // Checkings for distiortion
      if (gameServices.paused() || gameServices.getCurrentTime() < 1) {
        gameServices.stopDrawing()
        if (this.gameType.includes('spotdistortion')) {
          const prevTouchSize = this.touchSize
          this.touchSize = this.logoSize
          this.showTouch()
          this.touchSize = prevTouchSize
          // Preserve distortion from crash, do not show distortion when the video is not started
          if (!this.gameType.includes('still')) return
        }
      }

      var originalWidth
      if (this.gameType.includes('still')) originalWidth = $('#myMedia')[0].naturalWidth
      else originalWidth = vid.videoWidth
      const ratio = ($('#myMedia').width() / originalWidth)
      gameServices.drawItem($('#logoImage'), $('#myMedia')[0], logoWidth, locations.leftPosition, locations.topPosition, ratio, this.distortionSpeed)
      if ($('#touchImage').is(':visible')) this.showTouch()
    },

    showTouch () {
      if (!gameServices.paused()) return
      const touchWidth = helpersService.computeItemSize($('#myMedia'), this.touchSize)
      const locations = helpersService.computeLocations($('#myMedia'), touchWidth, this.fixedStartX, this.fixedStartY)
      gameServices.drawTouch($('#touchImage'), touchWidth, locations.leftPosition, locations.topPosition)
    },

    showBlow () {
      if (!this.gameType.includes('spot')) return
      const itemWidth = helpersService.computeItemSize($('#myMedia'), this.logoSize)
      const locations = helpersService.computeLocations($('#myMedia'), itemWidth, this.fixedStartX, this.fixedStartY)
      gameServices.drawBlow($('#blowImage'), itemWidth, locations.leftPosition, locations.topPosition)
    },

    emojiClicked (emojiNumber) {
      this.logoImagePath = `images/emoji ${emojiNumber}.png`
      $('#logoImage').attr('src', this.logoImagePath)
    },

    updateComplexityLevel () {
      if (this.gameType === 'timeit') {
        this.complexity = parseInt(this.maxScreenshotsNumber / this.totalNumberOfAppearances * 100)
      } else {
        var complexity = 2 * this.maxLogoSize / this.logoSize + this.maxScreenshotsNumber * this.maxAverageTimeToReact / this.averageTimeToReact
        var maxPossibleComplexity = 2 * this.maxLogoSize / this.minLogoSize + this.totalNumberOfAppearances * this.maxAverageTimeToReact / this.minAverageTimeToReact
        complexity = complexity / maxPossibleComplexity * 100
        complexity = parseInt(complexity) + 4
        this.complexity = complexity
      }
      console.log('updated complexity level is : ' + this.complexity)
    },

    setComplexityLevel () {
      console.log('Complexity is : ' + this.complexity)
    },

    updateNumberOfScreenshots () {
      this.updateScreenshotButtons()
      this.updateScreenshootAppearanceParams(this.maxScreenshotsNumber, false)
      this.setPublisherPanelParams()
    },

    updateScreenshotButtons () {
      this.updateScreenshotAppearanceObjects = [...Array(parseInt(this.maxScreenshotsNumber))].map((item, index) => {
        return { label: index + 1, value: index + 1 }
      })
      for (var i = 1; i <= this.maxScreenshotsNumber; i++) {
        if (!appearances[i] || !appearances[i].startTime) {
          console.log('updateScreenshotButtons > ' + this.maxScreenshotsNumber + ', setting : ' + i)
          this.setRandomScreenshot(i)
        }
      }
      // console.log(appearances[this.maxScreenshotsNumber])
    },

    updateAppearanceWithParams () {
      console.log('getting publisher panel params for: ' + this.activeAppearance)
      if (this.activeAppearance === 0) {
        console.log('the panel is hidden, nothing to set')
      } else {
        appearances[this.activeAppearance].startTime = parseFloat($('#startTime').val())
        appearances[this.activeAppearance].toleranceTime = parseFloat($('#averageToleranceTime').val())
        appearances[this.activeAppearance].startX = parseInt($('#startX').val())
        appearances[this.activeAppearance].startY = parseInt($('#startY').val())
      }
      this.updateScreenshootAppearanceParams(this.activeAppearance, true)
    },

    // Check if entered time is greater than video duration
    updateScreenshootAppearanceParams (screenshotNumber, forceShowPanel) {
      // Check if this was called while playing
      if (!gameServices.paused()) {
        this.model = 0
        return
      }
      // Check if the same button was clicked to hide the options bar
      if (!screenshotNumber && this.activeAppearance === this.model) {
        this.hideScreenshotOptions()
        return
      }
      // Check if the number of screenshots was changed by click on button
      if (!screenshotNumber) {
        screenshotNumber = this.model
        forceShowPanel = true
      }
      // Just the number of screenshots was changed
      if (screenshotNumber && !forceShowPanel) {
        this.setPublisherPanelParams()
      } else {
      // Clicked on number of appearance
        this.hideWelcomeScreen(true) // should stay here, call order matters
        this.activeAppearance = parseInt(screenshotNumber)
        this.model = this.activeAppearance
        this.showLogo(appearances[screenshotNumber].startX, appearances[screenshotNumber].startY)
        gameServices.setCurrentTime(appearances[screenshotNumber].startTime)
        this.setPublisherPanelParams()
        if (!forceShowPanel) {
          this.activeAppearance = 0
          this.model = this.activeAppearance
        }
      }
    },

    setPublisherPanelParams () {
      // console.log('setting publisher panel params for: ' + this.activeAppearance)
      if (this.activeAppearance === 0) {
        console.log('the panel is hidden, nothing to set')
      } else {
        $('#startTime').val(appearances[this.activeAppearance].startTime)
        $('#startX').val(appearances[this.activeAppearance].startX)
        $('#startY').val(appearances[this.activeAppearance].startY)
      }
      $('#videoPath').val(videoPath)
      this.setAverageTimeToReact()
      this.updateAverageTimeToReact()
    },

    setAverageTimeToReact () {
      // this.averageTimeToReact = 0
      // for (var i = 1; i <= this.maxScreenshotsNumber; i++) {
      //   this.averageTimeToReact += parseFloat(appearances[i].toleranceTime)
      // }
      // this.averageTimeToReact = (this.averageTimeToReact / this.maxScreenshotsNumber).toFixed(1)
      for (var i = 1; i <= this.maxScreenshotsNumber; i++) {
        appearances[i].toleranceTime = this.averageTimeToReact
      }
    },

    updateAverageTimeToReact () {
      if (this.gameType === 'timeit') return
      for (var i = 1; i <= this.maxScreenshotsNumber; i++) {
        // check if appearances overlap
        var maxTimeDistance = appearances[i + 1].startTime - appearances[i].startTime - 0.2
        maxTimeDistance = parseFloat(maxTimeDistance).toFixed(1)
        if (i < this.maxScreenshotsNumber && parseFloat(this.averageTimeToReact) > maxTimeDistance) {
          this.averageTimeToReact = maxTimeDistance
          this.showWarningMessage('Too big time to react, appearances overlap.')
          this.updateAverageTimeToReact()
          return
        } else appearances[i].toleranceTime = parseFloat(this.averageTimeToReact)
      }
      this.updateComplexityLevel()
    },

    updateLogoSize () {
      if (parseInt(this.touchSize) < parseInt(this.logoSize)) this.touchSize = this.logoSize
      this.showLogo(this.fixedStartX, this.fixedStartY)
      this.updateComplexityLevel()
    },

    updateTouchSize () {
      this.showTouch()
      this.updateComplexityLevel()
    },

    updateGameDuration () {
      // if contains still media.setGameDuration(gameDuration)
      gameServices.setGameDuration(this.gameDuration)
    },

    updateSource (src, target) {
      // Set new image
      var fr = new FileReader()
      // when image is loaded, set the src of the image where you want to display it
      fr.onload = function (e) {
        target.attr('src', this.result)
      }
      src.on('change', function () {
        // If user clicked cancel intead of selecting a file
        if (typeof src.prop('files')[0] === 'undefined') {
          return
        }
        // Fill the file reader with image data
        fr.readAsDataURL(src.prop('files')[0])
        // this.logoImagePath = '~'
        // $('#logoImagePath').val('~')
        $('#logoImagePath').prop('disabled', true)
        // $('#videoPath').val('~')
        $('#videoPath').prop('disabled', true)
        // $('#stillImagePath').val('~')
        $('#stillImagePath').prop('disabled', true)
      })
    },

    createGame () {
      if ($('#newLogoImagePath').get(0).files[0]) {
        if (!$('#uploadNewImageButton').prop('disabled')) {
          this.showWarningMessage('Upload your Logo before saving.')
          return
        } else {
          this.logoImagePath = 'images/' + $('#newLogoImagePath').get(0).files[0].name
        }
      }
      if ($('#newVideoPath').get(0).files[0]) {
        if (!$('#uploadNewVideoButton').prop('disabled')) {
          this.showWarningMessage('Upload your clip before saving.')
          return
        } else {
          videoPath = 'videos/' + $('#newVideoPath').get(0).files[0].name
        }
      }

      $('#createGameButton').prop('disabled', true)
      $.ajax({
        type: 'POST',
        // https://3.129.243.241:8443//tsb//creategame
        // http://localhost:8080//creategame
        url: 'https://3.129.243.241:8443//creategame',
        data: {
          gameType: this.gameType,
          maxScreenshotsNumber: this.maxScreenshotsNumber,
          totalNumberOfAppearances: this.totalNumberOfAppearances,
          logoImagePath: this.logoImagePath,
          logoSize: this.logoSize,
          touchSize: this.touchSize,
          videoPath: videoPath,
          distortionSpeed: this.distortionSpeed,
          distortionType: this.distortionType,
          stillImagePath: this.stillImagePath,
          gameDuration: this.gameDuration,
          appearances: JSON.stringify(appearances)
        },
        success: function (result) {
          console.log(result)
          // alert('Game was saved successfully, ID is : ' + result)
          this.showWarningMessage('Game was saved successfully, ID is : ' + result)
          this.$router.push({
            name: 'catalogpage'
          })
        }.bind(this),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          this.showWarningMessage('Error! Cannot save the game!')
        }.bind(this),
        complete: function (data) {
          // If this is publisher mode update the screen and show the new params
        }
      })
    }
  },

  directives: {
    autofocus: {
      inserted (el) {
        // el.focus()
      }
    }
  },

  beforeCreate () {
    // Preload images
    var img = new Image().src = 'images/oetker.png'
    img = new Image()
    console.log('beforeCreate loaded all images : ' + img)
  },

  beforeMount () {
    // window.storage.password = 'ilovegames'
    var pass = this.$route.params.password
    if (typeof pass === 'undefined') {
      console.log('No Password')
      pass = window.storage.password
    } else {
      window.storage.password = pass
    }
    console.log('Password is: ' + pass)
    if (typeof pass === 'undefined') {
      // Take to password page
      this.$router.push({
        name: 'askpasspage'
      })
    } else {
      this.loadGame()
    }
  },

  mounted () {
    console.log('mounted')
    if (this.gameType === null) return
    vid = this.$refs.myMedia
    window.addEventListener('resize', () => {
      // if (!this.$q.platform.is.mobile) this.hidePublisherPanel((window.innerWidth < 1024))
    })
    window.addEventListener('resize', debounce(function (e) {
      if (gameServices.paused()) this.showLogo(this.fixedStartX, this.fixedStartY)
    }.bind(this)))
    $('#myMedia').resize(function () {
      this.showLogo(this.fixedStartX, this.fixedStartY)
    }.bind(this))

    this.setGame()
    // this.hidePublisherPanel((window.innerWidth < 1024))
  },

  beforeDestroy () {
    console.log('Destroyyy')
    gameServices.destroy()
  }
}

function debounce (func) {
  var timer
  return function (event) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(func, 100, event)
  }
}

$(document).ready(function (e) {
  $('#imageUploadForm').on('submit', function (e) {
    e.preventDefault()
    $('#uploading').show()
    var formData = new FormData(this)
    $.ajax({
      type: 'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        console.log('success')
        console.log(data)
        $('#uploadNewImageButton').prop('disabled', true)
        var filename = $('#newLogoImagePath').get(0).files[0].name
        $('#logoImagePath').val(filename)
        alert(filename + ' uploaded.')
      },
      error: function (data) {
        console.log('error')
        console.log(data)
        alert('Error was received!')
      },
      complete: function () {
        $('#uploading').hide()
      }
    })
  })
  $('#videoUploadForm').on('submit', function (e) {
    e.preventDefault()
    $('#uploading').show()
    var formData = new FormData(this)
    $.ajax({
      type: 'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        console.log('"success"')
        console.log(data)
        $('#uploadNewVideoButton').prop('disabled', true)
        var filename = $('#newVideoPath').get(0).files[0].name
        $('#videoPath').val(filename)
        alert(filename + ' uploaded.')
      },
      error: function (data) {
        console.log('"error"')
        console.log(data)
        alert('Error was received!')
      },
      complete: function () {
        $('#uploading').hide()
      }
    })
  })
})
// screen.orientation.lock()
// screen.lockOrientation('orientation')
// screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation
</script>

<style>
</style>
