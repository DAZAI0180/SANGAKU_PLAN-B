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
                  src="https://firebasestorage.googleapis.com/v0/b/sangakuproject-e6177.appspot.com/o/images%2Fdotlive_chieri_20180930.png?alt=media&token=69930a31-3874-4e8c-9ab7-4c86eb6b2697"
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