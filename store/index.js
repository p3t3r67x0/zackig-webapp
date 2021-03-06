const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => ({
  userId: null,
  loading: false,
  userRoles: null,
  accessToken: null,
  refreshToken: null,
  historyBack: null,
  userAvatarUrl: null,
  userAvatar: null,
  userName: null
})

export const mutations = {
  updateUserId(state, userId) {
    state.userId = userId
  },
  updateUserRoles(state, userRoles) {
    state.userRoles = userRoles
  },
  updateAccessToken(state, accessToken) {
    state.accessToken = accessToken
  },
  updateRefreshToken(state, refreshToken) {
    state.refreshToken = refreshToken
  },
  updateUserAvatarUrl(state, avatarUrl) {
    state.userAvatarUrl = avatarUrl
  },
  updateUserAvatar(state, avatar) {
    state.userAvatar = avatar
  },
  updateLoadingIndicator(state, loading) {
    state.loading = loading
  },
  updateHistoryBack(state, path) {
    state.historyBack = path
  },
  updateUserName(state, name) {
    state.userName = name
  }
}

export const actions = {
  nuxtServerInit({
    commit
  }, {
    req
  }) {
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)

      try {
        commit('updateUserId', parsed.USER_ID)
        commit('updateUserName', parsed.USER_NAME)
        commit('updateUserAvatarUrl', parsed.USER_AVATAR_URL)
        commit('updateUserRoles', JSON.parse(parsed.USER_ROLES))
        commit('updateAccessToken', parsed.USER_ACCESS_TOKEN)
        commit('updateRefreshToken', parsed.USER_REFRESH_TOKEN)
      } catch (err) {
        console.log('error setting cookie value to store')
      }
    }
  }
}
