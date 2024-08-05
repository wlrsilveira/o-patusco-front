<template>
  <v-app :style="isLoginPage ? 'background-color: #bbf2c7' : 'background-color: #ebf7ed'">
    <!-- Barra de navegação -->
    <v-app-bar v-if="!isLoginPage" app style="background-color: #f9fffd;">
      <v-app-bar-nav-icon @click="toggleDrawer"  />
      <v-spacer></v-spacer>
      <v-text class="mr-5">Olá, {{ this.user?.name }}</v-text>
    </v-app-bar>

    <!-- Navegação lateral -->
    <v-navigation-drawer v-if="!isLoginPage" v-model="drawer" app style="background-color:#f9fffd;">
      <v-list dense>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="./assets/logo.jpeg"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item to="/appointments"
          router
          v-if="checkPermission('schedule_appointments')"
        >
          <v-row>
            <v-col cols="2">
              <v-list-item-icon>
                <v-icon>mdi-calendar</v-icon>
              </v-list-item-icon>
            </v-col>
            <v-col>
              <v-list-item-content>
                <v-list-item-title>Consultas</v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item to="/DoctorAppointments"
          router
          v-if="checkAppointmentPermission()"
        >
          <v-row>
            <v-col cols="2">
              <v-list-item-icon>
                <v-icon>mdi-calendar</v-icon>
              </v-list-item-icon>
            </v-col>
            <v-col>
              <v-list-item-content>
                <v-list-item-title>Consultas</v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item to="/attendants" router v-if="checkPermission('attendants')">
          <v-row>
            <v-col cols="2">
              <v-list-item-icon>
                <v-icon>mdi-account-edit</v-icon>
              </v-list-item-icon>
            </v-col>
            <v-col>
              <v-list-item-content>
                <v-list-item-title>Atendentes</v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item to="/doctors" router v-if="checkPermission('doctors')">
          <v-row>
            <v-col cols="2">
              <v-list-item-icon>
                <v-icon>mdi-doctor</v-icon>
              </v-list-item-icon>
            </v-col>
            <v-col>
              <v-list-item-content>
                <v-list-item-title>Médicos</v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item to="/recepcionists" router v-if="checkPermission('recepcionists')">
          <v-row>
            <v-col cols="2">
              <v-list-item-icon>
                <v-icon>mdi-badge-account</v-icon>
              </v-list-item-icon>
            </v-col>
            <v-col>
              <v-list-item-content>
                <v-list-item-title>Recepcionistas</v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item router class="link" v-on:click="loggout">
          <v-row>
            <v-col cols="2">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
            </v-col>
            <v-col>
              <v-list-item-content>
                <v-list-item-title>Sair</v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <!-- Conteúdo principal -->
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/axios';
export default {
  data() {
    const userData = localStorage.getItem('userData');
    const storedPermissions = localStorage.getItem('permissions');
    let permissions = [];

    if (storedPermissions) {
      try {
        const parsedPermissions = JSON.parse(storedPermissions);
        if (parsedPermissions[0] && parsedPermissions[0].permissions) {
          permissions = parsedPermissions[0].permissions.map(permission => permission.name);
        }
      } catch (error) {
        console.error('Error parsing permissions:', error);
      }
    }

    return {
      drawer: true,
      user: userData ? JSON.parse(userData) : null,
      permissions,
    };
  },
  setup() {
    const route = useRoute();
    const isLoginPage = computed(() => route.path === '/login');
    return { isLoginPage };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    checkAppointmentPermission() {
      return this.permissions.includes('view_my_appointments')
        || this.permissions.includes('update_my_appointments');
    },
    async loggout() {

      const response = await api.post('/auth/logout');
      if (response.status == 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('permissions');
        this.$router.push('/login');
        return false;
      }

    },
    checkPermission(routeName) {
      return this.permissions.includes(routeName);
    }
  }
}
</script>

<style>
.v-app-bar {
  /*background-color: #b9dac4 !important;*/
  /*background-color: #7c9484 !important;*/
  color: #000 !important;
}
.v-navigation-drawer__content {
  /*background-color: #c5cfc9 !important;*/
  color: #000 !important;
}
.v-main {
  /*background-color: #f0f0f0 !important;*/
  color: #000 !important;
}
.link {
  cursor: pointer;
}
.card-title {
  /*background-color: #b9dac4;*/
}
.swal2-cancel {
  background-color: #b00020 !important;
  color:  #fff !important;
}
.swal2-confirm {
  background-color: #1867c0 !important;
  color:  #fff !important;
}
</style>
