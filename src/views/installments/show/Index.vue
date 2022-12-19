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
              $t("pages.show_installments.tabs.basic")
            }}</v-tab>
            <v-tab
              v-if="$permissions().has(['students::retrieve'])"
              href="#students"
            >
              {{ $t("pages.show_installments.tabs.students") }}
            </v-tab>
            <v-tab
              v-if="canEdit && $permissions().has(['installments::update'])"
              href="#edit"
              >{{ $t("misc.edit") }}</v-tab
            >

            <v-tab
              v-if="canRemove && $permissions().has(['installments::remove'])"
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
            <installments-tab-basics :installments="installments" />
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
            <installments-tab-edit
              v-if="canEdit && $permissions().has(['installments::update'])"
              :installments="installments"
            />
          </v-tab-item>
          <v-tab-item value="remove">
            <installments-tab-remove
              v-if="canRemove && $permissions().has(['installments::remove'])"
              :installments="installments"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
  <script>
import api from "@/api";

import StudentsList from "@/views/students/StudentsList.vue";
import { DEFAULT_INSTALLMENT_ID } from "../config";
import InstallmentsTabBasics from "./tabs/InstallmentsTabBasics.vue";
import InstallmentsTabEdit from "./tabs/InstallmentsTabEdit.vue";
import InstallmentsTabRemove from "./tabs/InstallmentsTabRemove.vue";
export default {
  components: {
    StudentsList,
    InstallmentsTabBasics,
    InstallmentsTabEdit,
    InstallmentsTabRemove,
  },
  async created() {
    this.$permissions().authorize(["installments::retrieve"]);
    await this.loadInstallments();
  },
  data() {
    return {
      openedTab: "basic",
      loading: false,
      installments: {},
    };
  },
  computed: {
    canEdit() {
      if (this.installments.id != DEFAULT_INSTALLMENT_ID) return true;
      return false;
    },
    canRemove() {
      if (this.installments.id != DEFAULT_INSTALLMENT_ID) return true;
      return false;
    },
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async loadInstallments() {
      const id = this.$route.params.id;
      this.loading = true;

      try {
        const response = await api.get(`/installments/${id}`);
        this.installments = response.data.data;
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
  