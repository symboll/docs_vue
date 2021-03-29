<template>
  <div>
    <v-dialog v-model="visible" max-width="500px" @click:outside="close">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col class="d-flex" cols="12">
                <v-text-field v-model="form.code" label="code"></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="12">
                <v-select
                  v-model="form.type"
                  :items="items"
                  label="type"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "authCodeDialog",
  data: () => ({
    items: ["PAGE", "FUNC"]
  }),
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formTitle: {
      type: String,
      required: true
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save", this.form);
    }
  }
};
</script>
<style scoped></style>
