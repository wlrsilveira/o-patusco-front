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
            v-model="form.password"
            :rules="passwordRules"
            label="Senha"
            type="password"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.password_confirmation"
            :rules="passwordConfirmationRules"
            label="Confirmar Senha"
            type="password"
            required
          />
        </v-col>

        <v-col cols="12">
          <v-btn type="submit" color="primary" :loading="loading">Enviar</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import api from '@/axios';
export default {
  props: {
    namespace: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      valid: false,
      loading: false,
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      nameRules: [
        v => !!v || 'Nome é obrigatório',
        v => (v && v.length <= 255) || 'Nome deve ter no máximo 255 caracteres',
      ],
      emailRules: [
        v => !!v || 'E-mail é obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
      ],
      passwordRules: [
        v => !!v || 'Senha é obrigatória',
        v => v.length >= 8 || 'Senha deve ter pelo menos 8 caracteres',
      ],
      passwordConfirmationRules: [
        v => !!v || 'Confirmação de senha é obrigatória',
        v => v === this.form.password || 'As senhas não correspondem',
      ],
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          const url = `/${this.namespace}`;

          await api.post(url, this.form)
              .then(response => {
                this.$swal.fire({
                title: 'Inserção dos dados do Usuário',
                text: 'Dados Alterados com Sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.form = {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
              };
              this.$router.back();
            });

        } catch (error) {
          this.$swal.fire({
            title: 'Edição dos dados do Usuário',
            text: 'Erro ao fazer login: ' + error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.loading = false;
        }
      }
    },
  }
}
</script>

<style scoped>
/* Adicione estilos personalizados, se necessário */
</style>
