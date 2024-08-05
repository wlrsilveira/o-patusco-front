<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title class="card-title">
          <v-link
            class="align-self-end link"
            @click="$router.push('/recepcionists')"
          >
            <v-icon class="mr-2">
              <v-icon>mdi-menu-left</v-icon>
            </v-icon>
          </v-link>
          Novo Recepcionista
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <form-create-user namespace="recepcionist"/>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
