<template>
  <div class="text-center">
    <v-dialog
      width="500"
      v-model="appointmentDialog"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Vincular Médico ao Atendimento
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-row>
              <v-col>
                <v-select
                  v-model="doctor_id"
                  :items="listDoctors"
                  item-title="name"
                  item-value="id"
                  label="Doutor"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            text
            @click="submit()"
          >
            Gravar
          </v-btn>

          <v-btn
            color="error"
            text
            @click="closeDialog"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  APPOINTMENT_DIALOG,
  APPOINTMENT
} from '@/store/Appointments/getters';
import {
  FETCH_USERS
} from '@/store/Users/actions';
import {
  SET_APPOINTMENT_DIALOG,
  SET_APPOINTMENT,
  SET_APPOINTMENT_DOCTOR
} from '@/store/Appointments/actions';
import {
  LIST_USERS
} from '@/store/Users/getters';
import { mapActions, mapGetters } from 'vuex';
export default {
  data () {
    return {
      valid: false,
      doctor_id: null
    }
  },
  methods: {
    ...mapActions({
      setAppointment: SET_APPOINTMENT,
      setAppointmentDialog: SET_APPOINTMENT_DIALOG,
      fetchDoctors: FETCH_USERS,
      setAppointmentDoctor: SET_APPOINTMENT_DOCTOR,
    }),
    closeDialog() {
      this.setAppointment(null);
      this.setAppointmentDialog(false);
    },
    fetchAllDoctors() {
      this.fetchDoctors({namespace: 'doctor'});
    },
    submit() {
      if (this.$refs.form.validate()) {
        try {
         this.setAppointmentDoctor(this.doctor_id)
            .then(response => {
              this.setAppointment(response.data);
              return response;
            });

            this.closeDialog();

            this.$swal.fire({
              title: 'Edição da Consulta',
              text: 'Dados Alterados com Sucesso!',
              icon: 'success',
              confirmButtonText: 'OK'
            });

        } catch (error) {
          this.$swal.fire({
            title: 'Edição da Consultao',
            text: 'Erro: ' + error,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    }
  },
  mounted(){
    this.fetchAllDoctors();
  },
  computed: {
    ...mapGetters({
      appointment: APPOINTMENT,
      appointmentDialog: APPOINTMENT_DIALOG,
      listDoctors: LIST_USERS,
    }),
  }
}
</script>
