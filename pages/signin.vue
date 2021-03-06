<template>
<div class="flex items-center justify-center mt-3 mx-3 lg:mx-0 lg:mt-32">
  <form @submit.prevent="loginSubmit" class="bg-white rounded-lg w-full max-w-sm p-3">
    <h1 class="text-2xl lg:text-4xl font-medium mb-3">{{ $t('navigation.signin') }}</h1>
    <p v-if="showResponse" class="text-red-500 lg:text-lg mb-3">{{ response }}</p>
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="email">
        {{ $t('email') }}
      </label>
      <input name="email" v-model="email" v-bind:class="{'border-red-500': errors.email}"
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="text" placeholder="me@example.com">
      <p v-if="errors.email" class="text-red-500 text-xs italic">{{ $t('entervalidmail') }}</p>
    </div>
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="password">
        {{ $t('password') }}
      </label>
      <input name="password" v-model="password" v-bind:class="{'border-red-500': errors.password}" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white" id="password"
        type="password" placeholder="••••••••">
      <p v-if="errors.password" class="text-red-500 text-xs italic">{{ $t('fillfield') }}</p>
    </div>
    <p class="text-right">
      <nuxt-link to="/reset" class="text-blue-400 hover:text-blue-600 focus:outline-none mr-2">{{ $t('forgotpw') }}</nuxt-link>
      <button class="cursor-pointer bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide p-2" type="submit">{{ $t('navigation.signin') }}</button>
    </p>
  </form>
</div>
</template>

<script>
const Cookie = require('js-cookie')

export default {
  data() {
    return {
      errors: {
        email: false,
        password: false
      },
      email: null,
      password: null,
      response: null,
      showResponse: false,
      emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }
  },
  computed: {
    hasAdminRole() {
      const roles = this.$store.state.userRoles

      if (Array.isArray(roles)) {
        return roles.includes('admin')
      }

      return false
    }
  },
  watch: {
    email: function() {
      if (this.email.trim() !== '') {
        if (this.emailRegex.test(this.email.trim())) {
          this.errors.email = false
        } else {
          this.errors.email = true
        }
      }
    },
    password: function() {
      if (this.password.trim() !== '') {
        if (this.password.trim().length > 2) {
          this.errors.password = false
        } else {
          this.errors.password = true
        }
      }
    }
  },
  middleware: 'auth',
  methods: {
    loginSubmit() {
      const isValidForm = (currentValue) => currentValue !== true

      Cookie.remove('USER_ID', {
        samesite: 'Strict',
        secure: true
      })
      Cookie.remove('USER_ROLES', {
        samesite: 'Strict',
        secure: true
      })
      Cookie.remove('USER_AVATAR_URL', {
        samesite: 'Strict',
        secure: true
      })
      Cookie.remove('USER_ACCESS_TOKEN', {
        samesite: 'Strict',
        secure: true
      })
      Cookie.remove('USER_REFRESH_TOKEN', {
        samesite: 'Strict',
        secure: true
      })

      this.$store.commit('updateUserId', null)
      this.$store.commit('updateUserAvatar', null)
      this.$store.commit('updateAccessToken', null)
      this.$store.commit('updateRefreshToken', null)

      if (!this.email) {
        this.errors.email = true
      }

      if (!this.password) {
        this.errors.password = true
      }

      if (Object.values(this.errors).every(isValidForm) === true) {
        this.$axios.$post(`${process.env.API_URL}/api/v1/signin`, {
          'email': this.email.trim(),
          'password': this.password.trim()
        }).then(res => {
          this.$store.commit('updateUserId', res.id)
          this.$store.commit('updateUserName', res.name)
          this.$store.commit('updateUserRoles', res.roles)
          this.$store.commit('updateUserAvatarUrl', res.avatar)
          this.$store.commit('updateAccessToken', res.access_token)

          Cookie.set('USER_ID', res.id, {
            samesite: 'Strict',
            secure: true
          })
          Cookie.set('USER_NAME', res.name, {
            samesite: 'Strict',
            secure: true
          })
          Cookie.set('USER_ROLES', JSON.stringify(res.roles), {
            samesite: 'Strict',
            secure: true
          })
          Cookie.set('USER_AVATAR_URL', res.avatar, {
            samesite: 'Strict',
            secure: true
          })
          Cookie.set('USER_ACCESS_TOKEN', res.access_token, {
            samesite: 'Strict',
            secure: true
          })
          Cookie.set('USER_REFRESH_TOKEN', res.refresh_token, {
            samesite: 'Strict',
            secure: true
          })

          const name = this.hasAdminRole ? 'admin' : 'account'

          this.$router.push(this.localePath({
            name: name
          }))
        }).catch(error => {
          this.showResponse = true

          if (error.hasOwnProperty('response')) {
            this.response = error.response.data.message
          } else {
            this.response = error.message
          }
        })
      }
    }
  }
}
</script>
