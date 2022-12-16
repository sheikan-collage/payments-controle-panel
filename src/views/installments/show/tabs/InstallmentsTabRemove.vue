<template>
  <div>
    <confirm-delete
      :show="showConfirmDelete"
      @cancel="showConfirmDelete = false"
      @confirm="remove"
    />
    <v-alert outlined prominent shaped text type="error" v-if="!canRemove">
      {{ $t("misc.cant_remove_students_relation") }}
      <br />
      <p class="mt-2">
        {{ installments.students_count }}
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
    installments: {
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
    this.$permissions().authorizeOneOf(["installments::remove"]);
  },
  computed: {
    canRemove() {
      return this.installments.students_count < 1;
    },
  },
  methods: {
    async remove() {
      this.loading = true;
      try {
        this.showConfirmDelete = false;
        await api.delete(`/installments/${this.installments.id}`);
        this.$router.back();
        mainEventBus.$emit("updateInstallments");
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