<template>
  <div>
    <confirm-delete
      :show="showConfirmDelete"
      @cancel="showConfirmDelete = false"
      @confirm="remove"
    />
    <v-alert outlined prominent shaped text type="error" v-if="!canRemove">
      {{ $t("misc.cant_remove_payments_relation") }}
      <br />
      <p class="mt-2">
        {{ student.payments_count }}
        <v-icon class="mx-2" color="error">mdi-account-group-outline</v-icon>
      </p>
    </v-alert>
    <v-btn
      color="error"
      x-large
      :disabled="!canRemove"
      @click="showConfirmDelete = true"
      :loading="loading"
    >
      <v-icon>mdi-trash-can-outline</v-icon>
      <span class="mx-2"></span>
      {{ $t("misc.remove") }}
    </v-btn>
  </div>
</template>

<script>
import api from "@/api";
import confirmDelete from "@/components/confirmDelete.vue";
import { mainEventBus } from "@/main";
export default {
  components: { confirmDelete },
  props: {
    student: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data: () => ({
    showConfirmDelete: false,
    loading: false,
  }),
  created() {
    this.$permissions().authorizeOneOf(["students::remove"]);
  },
  computed: {
    canRemove() {
      return true;
      // return this.student.payments_count < 1;
    },
  },
  methods: {
    async remove() {
      this.loading = true;
      try {
        this.showConfirmDelete = false;
        await api.delete(`/students/${this.student.id}`);
        this.$router.back();
        mainEventBus.$emit("updateStudents");
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style>
</style>