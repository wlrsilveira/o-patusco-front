<template>
  <v-container>
    <v-form ref="form" v-model="valid" @submit.prevent="submit">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.name"
            :rules="nameRules"
            label="Nome"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.email"
            :rules="emailRules"
            label="E-mail"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.animal_name"
            :rules="animalNameRules"
            label="Nome do Animal"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.animal_age"
            :rules="animalAgeRules"
            label="Idade do Animal"
            type="number"
            required
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="form.symptoms"
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

        <v-col cols="12" md="6">
          <v-select
            v-model="form.period"
            :items="periodItems"
            item-title="text"
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

            item-title="description"
            item-value="id"
            label="Tipo de Animal"
            required
          />
        </v-col>

        <v-col cols="12">
          <v-btn type="submit" color="success" :loading="loading">Enviar</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import {
  APPOINTMENT_ANIMAL_TYPES
} from '@/store/Appointments/getters';
import {
  FETCH_ANIMAL_TYPES,
  POST_APPOINTMENT
} from '@/store/Appointments/actions';
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      valid: false,
      menu: false,
      loading: false,
      form: {
        name: '',
        email: '',
        animal_name: '',
        animal_age: '',
        symptoms: '',
        date: '',
        period: '',
        animal_type_id: null,
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
      ],
      dateRules: [
        v => !!v || 'Data é obrigatória',
      ],
      periodRules: [
        v => !!v || 'Período é obrigatório',
      ],
      animalTypeIdRules: [
        v => !!v || 'Tipo de animal é obrigatório',
        v => this.animalTypes.some(type => type.id === v) || 'Tipo de animal inválido',
      ],
    }
  },
  computed: {
    ...mapGetters({
      animalTypes: APPOINTMENT_ANIMAL_TYPES
    })
  },
  methods: {
    ...mapActions({
      fetchAnimalTypes: FETCH_ANIMAL_TYPES,
      postAppointment: POST_APPOINTMENT
    }),
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.postAppointment(this.form)
          .then(response => {
            if (response.status === 201) {
              this.$swal.fire({
                title: 'Inserção de Consulta',
                text: 'Consulta inserida com Sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.$router.back();
            }
            console.log(response);
            this.$swal.fire({
              title: 'Inserção de Consulta',
              text: 'Erro ao inserir a consulta: ' + response.response.data.message,
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
  }
}
</script>

<style scoped>
/* Adicione estilos personalizados, se necessário */
</style>
