<template>
  <q-page padding>
    <div>
      <table class="passwords">
        <tr>
          <td>Password</td>
          <td>Expires</td>
          <td>Notes</td>
        </tr>
        <tr v-for="password in passwords" :key="password.password" :class="{ expired: password.expired }">
          <td>{{password.password}}</td>
          <td>{{password.expires}}</td>
          <td>{{password.notes}}</td>
        </tr>
      </table>
      <br><br><br>
      <label>Developer </label>
      <a href="mailto:hovik.khasikyan@gmail.com">hovik.khasikyan@gmail.com</a>
    </div>
  </q-page>
</template>

<script>
var $ = require('jquery')

export default {
  data () {
    return {
      passwords: [
        // { password: 'samuel', expires: '01/09/2020', isExpired: true, notes: 'shared with samuel' }, ...
      ]
    }
  },

  beforeMount () {
    var pass = this.$route.params.password
    if (typeof pass !== 'undefined') {
      window.storage.password = pass
    }
    console.log('Password is: ' + window.storage.password)
    this.getPasswordList()
  },

  mounted () {
    $('#toolbarTitle').text('Admin panel')
  },

  methods: {
    getPasswordList () {
      $.ajax({
        type: 'GET',
        async: false,
        url: 'https://3.129.243.241:8443/getpasswords?password=' + window.storage.password,
        // url: 'http://localhost:8080/getpasswords?password=' + window.storage.password,
        dataType: 'json',
        success: result => {
          console.log(result)
          this.passwords = result // JSON.parse(result)
          // this.passwords = data
        }, // .bind(this),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown)
          this.passwords = null
          // this.showWarningMessage('Server sent an error! Could not connect to backend, loading default data!')
          console.log('Errrrrrrrroor, no admin permission!')
          this.$router.push({
            name: 'askpasspage'
          })
        }.bind(this),
        complete: function (data) {
        }
      })
    }
  }
}
</script>

<style>
.passwords {
  margin-top: 45px;
  font-size: 14px;
}
.passwords td {
  padding: 2px 10px;
}
.passwords tr:first-of-type {
  font-weight: 600;
}
.passwords tr.expired {
  color: red;
}
</style>
