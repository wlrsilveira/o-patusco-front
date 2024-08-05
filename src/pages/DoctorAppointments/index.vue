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
            <form-search-appointment
              :doctor_id="doctorId"
              namespace="my/appointments"
            />
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
                  @click="viewAppointment(item, false)"
                >
                  <v-icon>mdi-file-edit-outline</v-icon>
                </v-btn>

              </template>
              </v-data-table-server>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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
      doctorId: localStorage.getItem('userData')
        ? JSON.parse(localStorage.getItem('userData')).id
        : 0,

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

    viewAppointment(item, readOnly = true) {
      console.log(item)
      this.setAppointment(item);
      this.setReadOnly(readOnly);
      this.$router.push('/DoctorAppointments/update')
    },

    fetchAll(props) {
      this.loading = true;
      props.search = this?.search;
      props.namespace = 'my/appointments';
      props.doctor_id = this.doctorId;
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
