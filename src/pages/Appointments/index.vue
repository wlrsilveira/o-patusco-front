<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title class="card-title">
          Consultas
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex justify-end mt-3">
              <v-btn
                class="align-self-end"
                color="primary"
                rounded
                @click="$router.push('/appointments/create')"
              >
                Novo Agendamento
                <v-icon class="ml-2">
                  <v-icon>mdi-menu-right</v-icon>
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <form-search-appointment />
          </v-row>

          <v-row>
            <v-col>
              <v-data-table-server
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items="listAppointments"
                :items-length="totalItems"
                :loading="loading"
                item-value="id"
                @update:options="fetchAll"
              >
              <template v-slot:item.actions="{ item }">

                <v-btn
                  color="primary"
                  fab
                  title="Visualizar"
                  x-small
                  class="mr-2"
                  v-if="verifyPermission('show_appointments')"
                  @click="viewAppointment(item)"
                >
                  <v-icon>mdi-eye-outline</v-icon>
                </v-btn>

                <v-btn
                  color="secondary"
                  fab
                  title="Editar"
                  x-small
                  class="mr-2"
                   v-if="verifyPermission('update_appointments')"
                  @click="viewAppointment(item, false)"
                >
                  <v-icon>mdi-file-edit-outline</v-icon>
                </v-btn>

                <v-btn
                  color="info"
                  fab
                  title="Atribuir Médico"
                  x-small
                  v-if="verifyPermission('attach_appointments') && !!item.doctor"
                  dark
                  class="mr-3"
                  @click="attachDoctor(item)"
                >
                  <v-icon>mdi-account-plus-outline</v-icon>
                </v-btn>

                <v-btn
                  color="error"
                  fab
                  title="Remover"
                  x-small
                  v-if="verifyPermission('delete_appointments')"
                  dark
                  @click="removeAppointment(item)"
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>

              </template>
              </v-data-table-server>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <attach-doctor-dialog v-if="verifyPermission('doctors')"/>

</template>
<script>
import {
  LIST_APPOINTMENTS,
  APPOINTMENT_LOADING,
  APPOINTMENT_TOTAL_ITEMS
} from '@/store/Appointments/getters';
import {
  SET_APPOINTMENT,
  SET_APPOINTMENT_DIALOG,
  SET_READ_ONLY,
  FETCH_APPOINTMENTS,
  DELETE_APPOINTMENT
} from '@/store/Appointments/actions';
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      itemsPerPage: 10,
      search: '',
      headers: [
        {
          title: 'Médico',
          align: 'start',
          sortable: true,
          key: 'doctor.name',
        },
        {
          title: 'Nome',
          align: 'start',
          sortable: true,
          key: 'client_name',
        },
        {
          title: 'E-mail',
          align: 'start',
          sortable: true,
          key: 'client_email',
        },
        {
          title: 'Nome do Animal',
          align: 'start',
          sortable: true,
          key: 'animal_name',
        },
        {
          title: 'Tipo do Animal',
          align: 'start',
          sortable: true,
          key: 'animal_type',
        },
        {
          title: 'Data',
          align: 'start',
          sortable: true,
          key: 'date',
        },
        {
          title: 'Ações',
          align: 'start',
          sortable: false,
          key: 'actions',
        }
      ],
      animalTypes: []
    }
  },
  methods: {
    ...mapActions({
      setAppointment: SET_APPOINTMENT,
      setAppointmentDialog: SET_APPOINTMENT_DIALOG,
      setReadOnly: SET_READ_ONLY,
      fetchAppointments: FETCH_APPOINTMENTS,
      deleteAppointment: DELETE_APPOINTMENT
    }),
    verifyPermission(permissionName){
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

      return permissions.includes(permissionName);
    },
    attachDoctor(item) {
      this.setAppointment(item);
      this.setAppointmentDialog(true);
      this.$router.push('/appointments/update')
    },
    viewAppointment(item, readOnly = true) {
      this.setAppointment(item);
      this.setReadOnly(readOnly);
      this.$router.push('/appointments/update')
    },
    removeAppointment(item) {
      this.$swal.fire({
        title: "Tem certeza?",
        text: "Essa ação não poderá ser revertida!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteAppointment(item.id)
            .then(() => {
              this.fetchAppointments();
              this.$swal.fire({
                title: "Deletado!",
                text: "Registro deletado com Sucesso.",
                icon: "success"
              });
          })
        }
      });
    },
    fetchAll(props) {
      this.loading = true;
      props.search = this?.search;
      props.namespace = 'appointment';
      this.fetchAppointments(props);
    }
  },
  computed: {
    ...mapGetters({
      listAppointments: LIST_APPOINTMENTS,
      loading: APPOINTMENT_LOADING,
      totalItems: APPOINTMENT_TOTAL_ITEMS
    })
  }
}
</script>
