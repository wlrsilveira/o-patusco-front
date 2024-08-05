import axios from 'axios';
import Swal from 'sweetalert2';
import router from './router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(config => {
  config.headers.Accept = 'application/json';
  if (! window.location.pathname.includes('/login')) {

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  return response;
}, error => {
  /*if (error.response && error.response.status === 401
      && !window.location.pathname.includes('/login')
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Sessão Expirada',
      text: 'Sua sessão expirou. Por favor, faça login novamente.',
      confirmButtonText: 'OK',
    }).then(() => {
      localStorage.removeItem('token');
      router.push('/login');
    });
  }

  if (error.response && error.response.status === 403) {
    Swal.fire({
      icon: 'warning',
      title: 'Não autorizado',
      text: 'Ação não permitida para este usuário.',
      confirmButtonText: 'OK',
    }).then(() => {
      localStorage.removeItem('token');
      router.push('/login');
    });
  }

  if (error.response && error.response.status === 422) {
    Swal.fire({
      icon: 'error',
      title: 'Ocorreu um erro',
      text: error.response.data.message,
      confirmButtonText: 'OK',
    })
  }*/

  return Promise.reject(error);
});

export default api;
