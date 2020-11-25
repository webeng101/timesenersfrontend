<template>
  <q-page padding>
    <h2>This page is under development</h2>
    <input v-model="message"
    @keyup.esc="clearMessage"
    @keyup.enter="alertMessage"
    v-autofocus
    :class="{ 'error' : message.length > 13 }"
    ref="messageInput"
    @keyup="handleKeyup"/>
    <button
      style="position: absolute; right: 10px"
      @click="counter++">{{ counter }}</button>
    <button @click="clearMessage">Clear</button>
    <h5
      class="border-grey"
      v-if="message.length">{{ message }}</h5>
    <h6 v-else>No message entered</h6>
    <hr>
    <p>Uppercase message: {{ messageUppercase }}</p>
    <p>Lowercase message: {{ message | messageLowercase }}</p>
    <div>
    </div>
    <div class="cover-transparent"></div>
  </q-page>
</template>

<script>
var $ = require('jquery')

export default {
  // name: 'PageIndex',
  data () {
    return {
      message: 'Quasar is awesome',
      showmessage: true,
      counter: 0
    }
  },
  computed: {
    messageUppercase () {
      return this.message.toUpperCase()
    }
  },
  methods: {
    clearMessage () {
      this.message = ''
    },
    alertMessage () {
      alert(this.message)
    },
    handleKeyup (e) {
      console.log(e)
      if (e.keyCode === 27) {
        this.clearMessage()
      } else if (e.keyCode === 13) {
        alert(this.message)
      }
    }
  },
  filters: {
    messageLowercase (value) {
      return value.toLowerCase()
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
    console.log('beforeCreated')
  },
  mounted () {
    console.log(this.$refs)
    $('#toolbarTitle').text('Sample page')
    this.$refs.messageInput.className = 'bg-green'
  },
  beforeDestroyed () {
    console.log('beforeDestroyed')
  }
}
</script>

<style type="text/css">
  .border-grey {
    border: 1px solid grey;
  }
  .error {
    color: red;
    background: pink;
  }
</style>
