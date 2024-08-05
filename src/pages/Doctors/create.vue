<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title class="card-title">
          <v-link
            class="align-self-end link"
            @click="$router.push('/doctors')"
          >
            <v-icon class="mr-2">
              <v-icon>mdi-menu-left</v-icon>
            </v-icon>
          </v-link>
          Novo Médico
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <form-create-user namespace="doctor"/>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {

    }
  }
}
</script>
