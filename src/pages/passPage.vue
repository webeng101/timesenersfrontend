<template>
  <q-page padding>
    <div style="text-align:center">
      <h3>Enter your password</h3>
      <input type="text" id="passwordElement">&nbsp;
      <button @click='setPassword()' type='button'>Log in</button>
    </div>
    <!--div class="cover-transparent"></div-->
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
    $('#toolbarTitle').text('Acess information')
  },

  methods: {
    setPassword () {
      window.storage.password = $('#passwordElement').val()
      console.log($('#passwordElement').val())
      // window.location.reload()
      console.log('"Rout is : "' + this.$route.name)
      this.$router.push({
        name: 'creategamepage',
        params: {
          gameType: 'spotlogo'
        }
      })
    }
  }
}
</script>

<style type="text/css">
</style>
