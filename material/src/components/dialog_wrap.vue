<template>
  <div>
    <v-dialog v-model="visible" :max-width="maxWidth" @click:outside="close">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <slot ></slot>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">
            {{ cancelText }}
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
            {{ confirmText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "DialogWrap",
  data: () => ({
  }),
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: '500px'
    },
    formTitle: {
      type: String,
      required: true
    },
    form: {
      type: Object,
      default: () => ({})
    },
    items: {
      type: Array,
      default: ()=> []
    },
    cancelText: {
      type: String,
      default: "Cancel"
    },
    confirmText: {
      type: String,
      default: 'Save'
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