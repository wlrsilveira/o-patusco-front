// src/plugins/sweetalert2.js
import Swal from 'sweetalert2';

export default {
  install: (app) => {
    app.config.globalProperties.$swal = Swal;
  }
};
