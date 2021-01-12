import Cookies from 'js-cookie';
import authHeader from './auth-header';

export default {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  getAll,
  getById,
  update,
  delete: _delete,
};

function login(identifier, password) {
  return axios
    .post(`${process.env.VUE_APP_API_URL}/auth/local`, {
      identifier,
      password,
    })
    .then((response) => {
      // Handle success.
      const { user } = response.data;
      const { jwt } = response.data;

      if (jwt) {
        Cookies.set('jwt', jwt);
        Cookies.set('user', user);
      }

      const { Authorization } = authHeader();
      axios.defaults.headers.common.Authorization = Authorization;

      return { user, jwt };
    });
}

function logout() {
  // remove user from local storage to log user out
  Cookies.remove('user');
  Cookies.remove('jwt');
  axios.defaults.headers.common.Authorization = '';
}
function register(user) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  };

  return fetch(
    `${process.env.VUE_APP_API_URL}/auth/local/register`,
    requestOptions
  ).then(handleResponse);
}
function update(user, id) {
  return axios
  .put(`${process.env.VUE_APP_API_URL}/users/${id}`,
    user,
  )
  .then((response) => {
    // Handle success.
    Cookies.set('user', response.data);
    return response
  });
}
function forgotPassword(email) {
  return axios
    .post(`${process.env.VUE_APP_API_URL}/auth/forgot-password`, {
      email
    })
    .then((response) => {
      // Handle success.
      const status = response.data
      return status
    });
}
function resetPassword(code, password, passwordConfirmation) {
  return axios
    .post(`${process.env.VUE_APP_API_URL}/auth/reset-password`, {
      code,
      password,
      passwordConfirmation,
    })
    .then((response) => {
      // Handle success.
      return response
    });
}

function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${process.env.VUE_APP_API_URL}/users`, requestOptions).then(
    handleResponse
  );
}

function getById(id) {
  return axios
  .get(`${process.env.VUE_APP_API_URL}/users/${id}`)
  .then((response) => {
    // Handle success.
    return response
  });
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  };

  return fetch(
    `${process.env.VUE_APP_API_URL}/users/${id}`,
    requestOptions
  ).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
