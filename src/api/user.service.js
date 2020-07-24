import authHeader from './auth-header'

export default {
  login,
  logout,
  getAll,
}

function login(identifier, password) {
  return axios
  .post(`${process.env.VUE_APP_STRAPI_API_URL}/auth/local`, {
    identifier,
    password,
  })
  .then((response) => {
    // Handle success.
    const user = response.data
    if (user.jwt) {
      localStorage.setItem('jwt', user.jwt)
      localStorage.setItem('user', user)
    }

    return user
  })
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
  localStorage.removeItem('jwt')
}

function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }

  return fetch(`${process.env.VUE_APP_STRAPI_API_URL}/users`, requestOptions).then(handleResponse)
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout()
        window.location.reload(true)
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
