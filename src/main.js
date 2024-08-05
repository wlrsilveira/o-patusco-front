/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import Vuex from "vuex";
import userModule from "./store/Users";
import swal from '@/plugins/sweetalert2';
import vuetify from '@/plugins/vuetify';
import appointmentModule from './store/Appointments';
const store = new Vuex.Store({
  modules: {
    userModule: userModule,
    appointmentModule: appointmentModule
  }
});

const app = createApp(App)

app.use(store)
app.use(swal)
app.use(vuetify)
registerPlugins(app)
app.mount('#app')
