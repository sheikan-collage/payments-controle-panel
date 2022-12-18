<template>
  <v-dialog :value="true" persistent scrollable transition="dialog-transition">
    <v-card :loading="loading" :disabled="loading" min-height="600">
      <v-card-title class="pa-0">
        <v-btn icon class="mx-2" large @click="goBack">
          <v-icon
            v-html="
              $t('direction').toLowerCase() == 'rtl'
                ? 'mdi-arrow-right '
                : 'mdi-arrow-left'
            "
          ></v-icon>
        </v-btn>
        <div class="d-inline-block">
          <v-tabs center-active v-model="openedTab">
            <v-tab href="#basic">{{
              $t("pages.show_student.tabs.basic")
            }}</v-tab>
            <v-tab
              v-if="$permissions().has(['payments::retrieve'])"
              href="#payments"
            >
              {{ $t("pages.show_student.tabs.payments") }}
            </v-tab>
            <v-tab
              v-if="$permissions().has(['students::update'])"
              href="#edit"
              >{{ $t("misc.edit") }}</v-tab
            >

            <v-tab
              v-if="$permissions().has(['students::remove'])"
              class="error--text"
              href="#remove"
              >{{ $t("misc.remove") }}</v-tab
            >
          </v-tabs>
        </div>
        <v-spacer></v-spacer>

        <v-btn icon class="mx-2" color="error" @click="goBack">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-text class="pa-4">
        <v-tabs-items v-model="openedTab">
          <v-tab-item value="basic">
            <students-tab-basics :student="student" />
          </v-tab-item>
          <v-tab-item
            v-if="$permissions().has(['payments::retrieve'])"
            value="payments"
          >
            <h1>students payments history</h1>
          </v-tab-item>
          <v-tab-item
            v-if="$permissions().has(['students::update'])"
            value="edit"
          >
            <students-tab-edit :student="student" />
          </v-tab-item>
          <v-tab-item
            v-if="$permissions().has(['students::remove'])"
            value="remove"
          >
            <students-tab-remove :student="student" />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
  <script>
import api from "@/api";
import StudentsTabBasics from "./tabs/StudentsTabBasics.vue";
import StudentsTabEdit from "./tabs/StudentsTabEdit.vue";
import StudentsTabRemove from "./tabs/StudentsTabRemove.vue";
export default {
  components: { StudentsTabBasics, StudentsTabEdit, StudentsTabRemove },
  async created() {
    this.$permissions().authorize(["students::retrieve"]);
    await this.loadStudent();
  },
  data() {
    return {
      openedTab: "basic",
      loading: false,
      student: {},
    };
  },
  computed: {},
  methods: {
    goBack() {
      window.history.back();
    },
    async loadStudent() {
      const id = this.$route.params.id;
      this.loading = true;

      try {
        const response = await api.get(`/students/${id}`);
        this.student = response.data.data;
      } catch (error) {
        console.log(error);
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>
  
  <style></style>
  