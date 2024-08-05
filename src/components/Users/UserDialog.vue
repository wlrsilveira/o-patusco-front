<template>
  <div class="text-center">
    <v-dialog
      width="500"
      v-model="userDialog"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ title }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="form.name"
                  :rules="nameRules"
                  label="Nome"
                  required
                  :disabled="readOnly"
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
            v-if="!readOnly"
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
  USER,
  USER_DIALOG,
  READ_ONLY
} from '@/store/Users/getters';
import {
  SET_USER,
  SET_USER_DIALOG,
  SET_READ_ONLY,
  FETCH_USERS,
} from '@/store/Users/actions';
import { mapActions, mapGetters } from 'vuex';
import api from '@/axios';
export default {
  props: {
    title: {
      type: String,
      default: 'Dados do Usuário',
      required: false,
    },
    namespace: {
      type: String,
      default: 'attendant',
      required: false,
    },
  },
  data () {
    return {
      valid: false,
      form: {
        name: this.user
          ? this?.user?.name
          : '',
      },
      nameRules: [
        v => !!v || 'Nome é obrigatório',
        v => (v && v.length <= 255) || 'Nome deve ter no máximo 255 caracteres',
      ]
    }
  },
  methods: {
    ...mapActions({
      setUser: SET_USER,
      setUserDialog: SET_USER_DIALOG,
      setReadOnly: SET_READ_ONLY,
      fetchAll: FETCH_USERS,
    }),
    closeDialog() {
      this.setUser(null);
      this.setUserDialog(false);
      this.setReadOnly(false);
    },
    async submit() {
      if (this.$refs.form.validate()) {

        try {
          const formData = {
            name: this.form.name,
          };

          const url = `/${this.namespace}/${this.user.id}`;

          await api.put(url, formData)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('Erro ao atualizar dados do atendente');
              }
              this.setUser(response.data);
              //const propTemp.namespace = this.namespace;
              this.fetchAll({namespace: this.namespace});
              return response;
            });

            this.closeDialog();

            this.$swal.fire({
              title: 'Edição dos dados do Usuário',
              text: 'Dados Alterados com Sucesso!',
              icon: 'success',
              confirmButtonText: 'OK'
            });

        } catch (error) {
          this.$swal.fire({
            title: 'Edição dos dados do Usuário',
            text: 'Erro ao fazer login: ' + error,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      user: USER,
      userDialog: USER_DIALOG,
      readOnly: READ_ONLY,
    }),
  },
  watch: {
    user(value) {
      this.form.name = value?.name || '';
    }
  },
}
</script>
