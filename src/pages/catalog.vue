<template>
  <q-page padding>
    <div style="text-align:center">
      <p>Choose your game</p>
    </div>
    <div class="row catalog">
      <div class="column" v-for="catalogItem in catalogItems" :key="catalogItem.id">
        <img :src="catalogItem.imageUrl" :alt="catalogItem.name" style="width:100%" @click="goToPage(catalogItem)">
        <span style="color:green">{{ catalogItem.id }}</span>
        <span style='cursor: pointer' @click='deleteGame(catalogItem.id)'>delete</span>
      </div>
    </div>
    <!--div class="cover-transparent"></div-->
    <div class="cover-transparent"></div>
  </q-page>
</template>

<script>
var $ = require('jquery')

export default {
  data () {
    return {
      catalogItems: null
    }
  },

  mounted () {
    $('#toolbarTitle').text('Catalog of games')
    this.loadAllGames()
  },

  methods: {
    goToPage (selectedItem) {
      // console.log(selectedItem)
      this.$router.push({
        name: 'gamepage',
        params: {
          gameId: selectedItem.id
        }
      })
    },

    deleteGame (gameID) {
      console.log('delete: ' + gameID)
      $.ajax({
        type: 'GET',
        // https://playaclip.com:8443//tsb//deletegame
        // http://localhost:8080//deletegame
        url: 'https://playaclip.com:8443//deletegame',
        // url: 'http://localhost:8080//deletegame',
        data: {
          gameID: gameID
        },
        success: function (result) {
          console.log(result)
          this.showWarningMessage('Deleted successfully!')

          var index = -1
          for (var i = 0; i < this.catalogItems.length; i++) {
            if (this.catalogItems[i].id === gameID) {
              index = i
              break
            }
          }
          if (index > -1) {
            this.catalogItems.splice(index, 1)
          }
        }.bind(this),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(textStatus)
          this.showWarningMessage('Error! Cannot delete the game!')
        }.bind(this),
        complete: function (data) {
          // If this is publisher mode update the screen and show the new params
        }
      })
    },

    showWarningMessage (mesage) {
      this.$q.notify({
        message: mesage,
        position: 'top-right',
        type: 'warning',
        timeout: 2000
      })
    },

    loadAllGames () {
      $.ajax({
        type: 'GET',
        url: 'https://playaclip.com:8443/getallgames',
        // url: 'http://localhost:8080/getallgames,
        success: function (result) {
          // console.log(result)
          this.catalogItems = []
          for (var i = 0; i < result.length; i++) {
            // console.log(result[i])
            this.catalogItems[i] = {
              id: result[i],
              name: 'Thumbnail',
              imageUrl: 'images/thumbnail_placeholder.png'
            }
          }
        }.bind(this),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown)
          // this.showWarningMessage('Server sent an error! Could not connect to backend, loading default data!')
        },
        complete: function (data) {
          // this.updateVisualsWithParams()
        }
      })
    }
  }
}
</script>

<style type="text/css">

/* The grid: Four equal columns that floats next to each other */
.catalog .column {
  float: left;
  width: 25%;
  padding: 10px;
}

/* Style the images inside the grid */
.column img {
  opacity: 0.9;
  cursor: pointer;
}

.column img:hover {
  opacity: 1;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

</style>
