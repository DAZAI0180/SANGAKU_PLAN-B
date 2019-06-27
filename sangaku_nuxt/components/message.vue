<template>
  <v-layout>
    <p>{{ message }}</p>
  </v-layout>
</template>

<script>
export default {
  props :{
    message: String
  }
}
</script>