<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title class="card-title">
          <v-link
            class="align-self-end link"
            @click="$router.push('/appointments')"
          >
            <v-icon class="mr-2">
              <v-icon>mdi-menu-left</v-icon>
            </v-icon>
          </v-link>
          Dados da Consulta
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex justify-start mt-3">
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <form-appointment />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
