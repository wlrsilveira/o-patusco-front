<template>
  <v-container>
    <v-card>
      <v-card-title class="bg-primary">
        <h3>Buscar Consulta</h3>
      </v-card-title>
      <v-form ref="form" class="mt-2" v-model="valid" @submit.prevent="submit">
        <v-card-text>
          <v-row>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Nome"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="E-mail"
                required
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.animal_name"
                label="Nome do Animal"
                required
              />
            </v-col>

            <v-col cols="12" md="4">

                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.date"
                      label="Data"
                      type="date"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="form.date" no-title @input="menu = false"></v-date-picker>
                </v-menu>

            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="form.animal_type_id"
                :items="animalTypes"
                item-title="description"
                item-value="id"
                label="Tipo de Animal"
                required
              />
            </v-col>

          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="d-flex justify-end mt-3">
            <v-btn type="button" @click="clearFilters" color="error">
              <v-icon>mdi-magnify</v-icon>
              Limpar Filtros
            </v-btn>
            <v-btn type="submit" color="primary">
              <v-icon>mdi-magnify</v-icon>
              Buscar
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-form>
    </v-card>

  </v-container>
</template>

<script>
import {
  APPOINTMENT_DIALOG,
  LIST_APPOINTMENTS,
  APPOINTMENT_LOADING,
  APPOINTMENT_TOTAL_ITEMS,
  APPOINTMENT_ANIMAL_TYPES
} from '@/store/Appointments/getters';
import {
  SET_APPOINTMENT,
  SET_APPOINTMENT_DIALOG,
  SET_READ_ONLY,
  FETCH_APPOINTMENTS,
  FETCH_ANIMAL_TYPES
} from '@/store/Appointments/actions';
import { mapActions, mapGetters } from 'vuex';
export default {
  props: {
    doctor_id: {
      type: Number,
      default: 0,
      required: false
    },
    namespace: {
      type: String,
      default: 'appointment',
      required: false
    }
  },
  data() {
    return {
      valid: false,
      menu: false,
      form: {
        name: '',
        email: '',
        animal_name: '',
        date: '',
        animal_type_id: null,
      },
    }
  },
  methods: {
    ...mapActions({
      setAppointment: SET_APPOINTMENT,
      setAppointmentDialog: SET_APPOINTMENT_DIALOG,
      setReadOnly: SET_READ_ONLY,
      fetchAppointments: FETCH_APPOINTMENTS,
      fetchAnimalTypes: FETCH_ANIMAL_TYPES
    }),
    clearFilters(){
      this.form.name = null;
      this.form.email = null;
      this.form.animal_name = null;
      this.form.date = null;
      this.form.animal_type_id = null;
      this.submit();
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.form.namespace = this.namespace;
        if (this.doctor_id) {
          this.form.doctor_id = this.doctor_id;
        }
        this.fetchAppointments(this.form);
      }
    }
  },
  mounted() {
    this.fetchAnimalTypes();
  },
  computed: {
    ...mapGetters({
      appointmentDialog: APPOINTMENT_DIALOG,
      listAppointments: LIST_APPOINTMENTS,
      loading: APPOINTMENT_LOADING,
      totalItems: APPOINTMENT_TOTAL_ITEMS,
      animalTypes: APPOINTMENT_ANIMAL_TYPES
    })
  }
}
</script>

<style scoped>
/* Adicione estilos personalizados, se necessário */
</style>
