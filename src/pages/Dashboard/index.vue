<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title class="card-title">
          Dashboard
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>

  <user-dialog
    title="Dados do Recepcionista"
    namespace="recepcionist"
  />

</template>
<script>

export default {
  data() {
    return {

    }
  },
}
</script>
