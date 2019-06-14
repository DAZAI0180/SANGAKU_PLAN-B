<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
    おおおおおおおおおおおおおおおおおおおおおおん
      <div>
    {{ data }}
  </div>
        </v-flex>
  </v-layout>
</template>

<script>
  export default {
    async asyncData ({ app }) {
      const data = await app.$axios.$get(`http://localhost/api`)
      return { data }
    }
  }
</script>