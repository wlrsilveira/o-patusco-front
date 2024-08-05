<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
      style="height: 100vh;"
    >
      <v-col cols="12" sm="8" md="4">
        <v-card style="border-radius: 20px;">
          <v-card-title>
            <v-img src="../../assets/logo.jpeg" max-height="200"/>
          </v-card-title>
          <v-card-subtitle>Entre com seu e-mail e senha</v-card-subtitle>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="submit">
              <v-text-field
                v-model="form.email"
                :rules="emailRules"
                label="E-mail"
                type="email"
                required
              />
              <v-text-field
                v-model="form.password"
                :rules="passwordRules"
                label="Senha"
                type="password"
                required
              />
              <v-btn
                type="submit"
                color="primary"
                rounded
                class="mt-4"
              >
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/axios';
export default {
  data() {
    return {
      valid: false,
      form: {
        email: 'admin@admin.com',
        password: '123456',
      },
      emailRules: [
        v => !!v || 'E-mail é obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
      ],
      passwordRules: [
        v => !!v || 'Senha é obrigatória',
      ],
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          const formData = {
            email: this.form.email,
            password: this.form.password,
          };

          const response = await api.post('/auth/login', formData);

          if (response.status !== 200) {
            throw new Error('Erro ao fazer login');
          }

          localStorage.setItem('token', response.data.access_token);
          localStorage.setItem('permissions', JSON.stringify(response.data.user.roles));
          localStorage.setItem('userData', JSON.stringify(response.data.user));

          this.$router.push('/dashboard');

        } catch (error) {

          this.$swal.fire({
            title: "Login!",
            text: "Credenciais inválidas ou erro ao fazer login. Tente novamente..",
            icon: "error"
          });

        }
      }
    },
  },
}
</script>

<style scoped>
/* Adicione estilos personalizados, se necessário */
</style>
