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
              $t("pages.show_reductions.tabs.basic")
            }}</v-tab>
            <v-tab
              v-if="$permissions().has(['students::retrieve'])"
              href="#students"
            >
              {{ $t("pages.show_reductions.tabs.students") }}
            </v-tab>
            <v-tab
              v-if="canEdit && $permissions().has(['reductions::update'])"
              href="#edit"
              >{{ $t("misc.edit") }}</v-tab
            >

            <v-tab
              v-if="canRemove && $permissions().has(['reductions::remove'])"
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
            <reductions-tab-basics :reductions="reductions" />
          </v-tab-item>
          <v-tab-item
            v-if="$permissions().has(['students::retrieve'])"
            value="students"
          >
            <students-list
              :fields="[
                'university_id',
                'name',
                'department',
                'level',
                'total_bill',
                'total_reductions',
                'installments_details',
                'is_active',
              ]"
              :validFields="[
                'university_id',
                'name',
                'department',
                'batch',
                'level',
                'fees_name',
                'fees_amount',
                'fees_currency',
                'installments_name',
                'installments_details',
                'reductions_name',
                'reductions_amount',
                'total_bill',
                'total_reductions',
                'is_active',
              ]"
              :bulk-assign="false"
            />
          </v-tab-item>
          <v-tab-item value="edit">
            <reductions-tab-edit
              :reductions="reductions"
              v-if="canEdit && $permissions().has(['reductions::update'])"
            />
          </v-tab-item>
          <v-tab-item value="remove">
            <reductions-tab-remove
              :reductions="reductions"
              v-if="canRemove && $permissions().has(['reductions::remove'])"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
  <script>
import api from "@/api";
import ReductionsTabBasics from "./tabs/ReductionsTabBasics.vue";
import ReductionsTabEdit from "./tabs/ReductionsTabEdit.vue";
import ReductionsTabRemove from "./tabs/ReductionsTabRemove.vue";
import StudentsList from "@/views/students/StudentsList.vue";
import { DEFAULT_REDUCTIONS_ID } from "../config";
export default {
  components: {
    ReductionsTabBasics,
    ReductionsTabEdit,
    ReductionsTabRemove,
    StudentsList,
  },
  async created() {
    this.$permissions().authorize(["reductions::retrieve"]);
    await this.loadReductions();
  },
  data() {
    return {
      openedTab: "basic",
      loading: false,
      reductions: {},
    };
  },
  computed: {
    canEdit() {
      if (this.reductions.id != DEFAULT_REDUCTIONS_ID) return true;
      return false;
    },
    canRemove() {
      if (this.reductions.id != DEFAULT_REDUCTIONS_ID) return true;
      return false;
    },
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async loadReductions() {
      const id = this.$route.params.id;
      this.loading = true;

      try {
        const response = await api.get(`/reductions/${id}`);
        this.reductions = response.data.data;
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
  