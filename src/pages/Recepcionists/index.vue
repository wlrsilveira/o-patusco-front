<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title class="card-title">
          Recepcionistas
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex justify-end mt-3">
              <v-btn
                class="align-self-end"
                color="primary"
                rounded
                @click="$router.push('/recepcionists/create')"
              >
                Novo Recepcionista
                <v-icon class="ml-2">
                  <v-icon>mdi-menu-right</v-icon>
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex justify-end mt-3">
              <v-text-field
                v-model="search"
                label="Buscar por nome ou e-mail"
                @input="fetchRecepcionists"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-data-table-server
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items="listRecepcionists"
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
                  @click="viewUser(item)"
                >
                  <v-icon>mdi-eye-outline</v-icon>
                </v-btn>

                <v-btn
                  color="secondary"
                  fab
                  title="Editar"
                  x-small
                  class="mr-2"
                  @click="viewUser(item, false)"
                >
                  <v-icon>mdi-file-edit-outline</v-icon>
                </v-btn>

                <v-btn
                  color="error"
                  fab
                  title="Remover"
                  x-small
                  dark
                  @click="removeUser(item)"
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

  <user-dialog
    title="Dados do Recepcionista"
    namespace="recepcionist"
  />

</template>
<script>
import api from '@/axios';
import {
  USER_DIALOG,
  LIST_USERS,
  LOADING,
  TOTAL_ITEMS
} from '@/store/Users/getters';
import {
  SET_USER,
  SET_USER_DIALOG,
  SET_READ_ONLY,
  FETCH_USERS,
} from '@/store/Users/actions';
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      itemsPerPage: 10,
      search: '',
      headers: [
        {
          title: 'Nome',
          align: 'start',
          sortable: true,
          key: 'name',
        },
        {
          title: 'E-mail',
          align: 'start',
          sortable: true,
          key: 'email',
        },
        {
          title: 'Ações',
          align: 'start',
          sortable: false,
          key: 'actions',
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      setRecepcionist: SET_USER,
      setRecepcionistDialog: SET_USER_DIALOG,
      setReadOnly: SET_READ_ONLY,
      fetchRecepcionists: FETCH_USERS
    }),
    viewUser(item, readOnly = true) {
      this.setRecepcionist(item);
      this.setRecepcionistDialog(true);
      this.setReadOnly(readOnly);
    },
    removeUser(item) {
      this.$swal.fire({
        title: "Tem certeza?",
        text: "Essa ação não poderá ser revertida!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
      }).then((result) => {
        if (result.isConfirmed) {
          api.delete(`/recepcionist/${item.id}`)
            .then(() => {
              this.fetchRecepcionists({namespace: 'recepcionist'});
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
      props.namespace = 'recepcionist';
      this.fetchRecepcionists(props);
    }
  },
  computed: {
    ...mapGetters({
      recepcionistDialog: USER_DIALOG,
      listRecepcionists: LIST_USERS,
      loading: LOADING,
      totalItems: TOTAL_ITEMS
    })
  }
}
</script>
