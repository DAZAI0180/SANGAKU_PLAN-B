<template>
      <v-card light>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-container v-bind="{ [`grid-list-${size}`]: true }" fluid >
          <v-layout row wrap>
            <v-flex
              v-for="n in 18"
              :key="n"
              xs4
              md3
            >
              <v-card flat tile>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/sangakuproject-e6177.appspot.com/o/images%2FC1eF-L3UkAE3uNV_orig.jpg?alt=media&token=d3710748-2de6-4885-bc9d-b35b637ffe27"
                  width="100px"
                  height="100px"
                  
                >
                <p>商品名</p>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        
      </v-card>
      
</template>

<script>

export default {
  data: () => ({
    size: "sm",
    items: []
  })
};
</script>