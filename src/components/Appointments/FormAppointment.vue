<template>
  <v-container>

    <v-form ref="form" v-model="valid" @submit.prevent="submit">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.name"
            :rules="nameRules"
            label="Nome"
            :disabled="readOnly"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.email"
            :rules="emailRules"
            :disabled="readOnly"
            label="E-mail"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.animal_name"
            :rules="animalNameRules"
            :disabled="readOnly"
            label="Nome do Animal"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.animal_age"
            :rules="animalAgeRules"
            :disabled="readOnly"
            label="Idade do Animal"
            type="number"
            required
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="form.symptoms"
            :disabled="readOnly"
            :rules="symptomsRules"
            label="Sintomas"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              :disabled="readOnly"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.date"
                  label="Data"
                  type="date"
                  :disabled="readOnly"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="form.date" no-title @input="menu = false"></v-date-picker>
            </v-menu>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.period"
            :items="periodItems"
            item-title="text"
            :disabled="readOnly"
            item-value="value"
            :rules="periodRules"
            label="Período"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.animal_type_id"
            :items="animalTypes"
            :rules="animalTypeIdRules"
            :disabled="readOnly"
            item-title="description"
            item-value="id"
            label="Tipo de Animal"
            required
          />
        </v-col>

        <v-col cols="12" v-if="!readOnly">
          <v-btn type="submit" color="success" :loading="loading">Enviar</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import {
  APPOINTMENT,
  APPOINTMENT_ANIMAL_TYPES,
  APPOINTMENT_READ_ONLY,
} from '@/store/Appointments/getters';
import {
  UPDATE_APPOINTMENT,
  FETCH_ANIMAL_TYPES,
} from '@/store/Appointments/actions';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      valid: false,
      menu: false,
      loading: false,
      form: {
        name: this.appointmentData?.client_name,
        email: this.appointmentData?.client_email,
        animal_name: this.appointmentData?.animal_name,
        animal_age: this.appointmentData?.animal_age,
        symptoms: this.appointmentData?.symptoms,
        date: this.appointmentData?.date,
        period: this.appointmentData?.period,
        animal_type_id: this.appointmentData?.animal_type_object.id,
      },
      periodItems: [
        { text: 'Manhã', value: 'morning' },
        { text: 'Tarde', value: 'afternoon' },
      ],
      nameRules: [
        v => !!v || 'Nome é obrigatório',
        v => (v && v.length <= 255) || 'Nome deve ter no máximo 255 caracteres',
      ],
      emailRules: [
        v => !!v || 'E-mail é obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
      ],
      animalNameRules: [
        v => !!v || 'Nome do animal é obrigatório',
      ],
      animalAgeRules: [
        v => !!v || 'Idade do animal é obrigatória',
        v => Number.isInteger(Number(v)) || 'Idade deve ser um número inteiro',
      ],
      symptomsRules: [
        v => !!v || 'Sintomas são obrigatórios',
      ],  mouinted() {

  },
      animalTypeIdRules: [
        v => !!v || 'Tipo de animal é obrigatório',
        v => this.animalTypes.some(type => type.id === v) || 'Tipo de animal inválido',
      ],
    }
  },
  computed: {
    ...mapGetters({
      appointmentData: APPOINTMENT,
      animalTypes: APPOINTMENT_ANIMAL_TYPES,
      readOnly: APPOINTMENT_READ_ONLY,
    })
  },
  methods: {
    ...mapActions({
      updateAppointment: UPDATE_APPOINTMENT,
      fetchAnimalTypes: FETCH_ANIMAL_TYPES,
    }),
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.updateAppointment(this.form)
          .then(response => {
            if (response.status === 200) {
              this.$swal.fire({
                title: 'Edição de Consulta',
                text: 'Consulta atualizada com Sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.$router.back();
            }
            this.$swal.fire({
              title: 'Edição de Consulta',
              text: 'Erro ao editar a consulta: ' + response.response.data.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
            this.loading = false;
          });
      }
    },
  },
  mounted() {
    this.fetchAnimalTypes();
    this.form = {
        name: this.appointmentData?.client_name,
        email: this.appointmentData?.client_email,
        animal_name: this.appointmentData?.animal_name,
        animal_age: this.appointmentData?.animal_age,
        symptoms: this.appointmentData?.symptoms,
        date: this.appointmentData?.date,
        period: this.appointmentData?.period,
        animal_type_id: this.appointmentData?.animal_type_object.id,
      };
  }
}
</script>
