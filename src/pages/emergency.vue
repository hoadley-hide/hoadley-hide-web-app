<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title> Emercency Contacts </v-card-title>

        <v-card-text>
          <a href="tel:0419286499">
            <v-icon>mdi-phone</v-icon>
            Call the Hoadley Hide Emercency Number
          </a>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>I don't have service!?</v-card-title>

        <v-card-text>
          Stay put, study the map, retrace your steps to the last stunt you were
          at.
        </v-card-text>

        <v-card-text>
          That stunt knows you have just left, and HHMT will check in with stunt
          teams to know if Venturers have not made it to the stunt they were
          intending to visit next.
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "default",
};
</script>