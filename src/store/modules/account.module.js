import router from '@/router/index'
import userService from '@/api/user.service'
import Cookies from 'js-cookie'

const rawUser = Cookies.get('user')
const user = rawUser ? JSON.parse(Cookies.get('user')) : null

const state = {
  status: {
    loggedIn: !!user,
  },
  user: user || null,
  role: user ? user.role : null,
}


const actions = {
  login({ dispatch, commit }, { identifier, password }) {
    commit('loginRequest', { identifier })
    return userService.login(identifier, password)
    .then(
      (response) => {
        commit('loginSuccess', response)
      },
      (error) => {
        commit('loginFailure', error)
        dispatch('alert/error', error, { root: true })
      },
    )
  },
  logout({ commit }) {
    userService.logout()
    commit('logout')
  },
  register({ dispatch, commit }, user) {
    commit('registerRequest', user)

    userService.register(user)
    .then(
      (response) => {
        commit('registerSuccess', response)
        setTimeout(() => {
          // display success message after route change completes
          dispatch('alert/success', 'Registration successful', { root: true })
        })
      },
      (error) => {
        commit('registerFailure', error)
        dispatch('alert/error', error, { root: true })
      },
    )
  },
  update({ dispatch, commit }, {user, id}) {
    commit('updateRequest', user, id)

    userService.update(user, id)
    .then(
      (response) => {
        commit('updateSuccess', response)
        setTimeout(() => {
          // display success message after route change completes
          dispatch('alert/success', 'Update successful', { root: true })
        })
      },
      (error) => {
        commit('updateFailure', error)
        dispatch('alert/error', error, { root: true })
      },
    )
  },
  forgotPassword({ dispatch, commit }, email) {
    commit('forgotPasswordRequest', email)

    userService.forgotPassword(email)
    .then(
      (response) => {
        commit('forgotPasswordSuccess', response)
        setTimeout(() => {
          // display success message after route change completes
          dispatch('alert/success', 'Email has been sent.', { root: true })
        })
      },
      (error) => {
        commit('forgotPasswordFailure', error)
        dispatch('alert/error', error, { root: true })
      },
    )
  },
  resetPassword({ dispatch, commit }, {code, password, passwordConfirmation}) {
    commit('resetPasswordRequest', code, password, passwordConfirmation)

    userService.resetPassword(code, password, passwordConfirmation)
    .then(
      (response) => {
        commit('resetPasswordSuccess', response)
        setTimeout(() => {
          // display success message after route change completes
          dispatch('alert/success', 'Password reset successful', { root: true })
        })
      },
      (error) => {
        commit('resetPasswordFailure', error)
        dispatch('alert/error', error, { root: true })
      },
    )
  },
  getById({ dispatch, commit }, id) {
    commit('getByIdRequest', id)

    userService.getById(id)
    .then(
      (data) => {
        commit('getByIdSuccess', data.data)
        setTimeout(() => {
          // display success message after route change completes
          // dispatch('alert/success', 'Registration successful', { root: true })
        })
      },
      (error) => {
        commit('getByIdFailure', error)
        dispatch('alert/error', error, { root: true })
      },
    )
  },
}

const mutations = {
  loginRequest(state, user) {
    state.status = { loggingIn: true }
    state.user = user
    state.role = user ? user.role : null
  },
  loginSuccess(state, response) {
    state.status = { loggedIn: true }
    state.user = response.user
    state.jwt = response.jwt
    state.role = response.user ? response.user.role : null
  },
  loginFailure(state, err) {
    if (err.message === 'Request failed with status code 400') {
      err.message = "That username or password combination doesn't exist"
    }
    state.status = { loggedIn: false, error: err }
    state.user = null
    state.role = null
    state.jwt = null
  },
  logout(state) {
    state.status = {}
    state.user = null
    state.jwt = null
    state.role = null
  },
  registerRequest(state, user) {
    state.status = { registering: true }
  },
  registerSuccess(state, user) {
    state.status = { registered: true }
  },
  registerFailure(state, error) {
    state.status = {error: error[0].messages}
  },
  updateRequest(state, user) {
    // state.status.updating = true
  },
  updateSuccess(state, data) {
    state.user = data.data
    state.status.updated = true
  },
  updateFailure(state, error) {
    state.status = {error: error[0].messages}
  },
  forgotPasswordRequest(state, email) {
    state.email = email
  },
  forgotPasswordSuccess(state, response) {
    state.status = { loggedIn: false, success: 'Email has been sent.' }
  },
  forgotPasswordFailure(state, err) {
    if (err.message === 'Request failed with status code 400') {
      err.message = "That email does not exist"
    }
    state.status = { loggedIn: false, error: err }
    state.user = null
    state.role = null
    state.jwt = null
  },
  resetPasswordRequest(state, code) {
    state.code = code
  },
  resetPasswordSuccess(state, response) {
    state.status = {success: 'Password Reset Successful.'}
  },
  resetPasswordFailure(state, err) {
    state.status = { loggedIn: false, error: err }
    state.user = null
    state.role = null
    state.jwt = null
  },
  getByIdRequest(state, user) {
    // state.status
  },
  getByIdSuccess(state, user) {
    if (!user.length) {
      state.user = user
    }
  },
  getByIdFailure(state, error) {
    state.status = {error: error[0].messages}
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
