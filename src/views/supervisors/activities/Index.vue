<template>
  <div>
    <v-dialog
      v-model="viewDetails"
      scrollable
      persistent
      max-width="800px"
      transition="dialog-transition"
      
    >
      <v-card>
        <v-card-title>
          {{ viewedItem.log_name }}
          <v-spacer></v-spacer>
          <v-btn
            icon
            color="error"
            @click="
              viewedItem = {};
              viewDetails = false;
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider class=""></v-divider>

        <v-card-text class="pt-4">
          <v-row>
            <v-col> 
                <json-viewer :value="viewedItem"></json-viewer>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <h2 class="display-2">
          {{ $t("pages.activities.title") }}
        </h2>
        <p class="my-2">{{ $t("pages.activities.subtitle") }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <search-field v-model="search" />
        <v-data-table
          :headers="headers"
          :items="activities"
          :loading="loading"
          :search="search"
        >
          <template v-slot:[`item.causer`]="{ item }">
            <v-btn
              color="primary"
              text
              v-if="$permissions().has(['supervisors::retrieve'])"
              route
              :to="{
                name: 'Supervisors.show',
                params: { user_name: item.causer.user_name },
              }"
              >@{{ item.causer.name }}</v-btn
            >
            <span v-else> @{{ item.causer.user_name }} </span>
          </template>
          <template v-slot:[`item.description`]="{ item }">
            <span
              class="font-weight-bold"
              :class="{
                'success--text':
                  item.description.toLowerCase().trim() == '[success]',
                'error--text':
                  item.description.toLowerCase().trim() == '[failed]',
              }"
            >
              {{ item.description }}
            </span>
          </template>
          <template v-slot:[`item.created_at`]="{ item }">
            <relative-date :date="item.created_at" />
          </template>
          <template v-slot:[`item.properties`]="{ item }">
            <v-btn
              color="info"
              icon
              outlined
              @click="
                viewedItem = item;
                viewDetails = true;
              "
            >
              <v-icon>mdi-unfold-more-vertical</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import searchField from "@/components/searchField.vue";
import { datatableColumn } from "@/components/ListDataTable.vue";
import api from "@/api";
import RelativeDate from "@/components/RelativeDate.vue";
import JsonViewer from 'vue-json-viewer'

export default {
  components: { searchField, RelativeDate, JsonViewer },
  created() {
    this.$permissions().authorizeOneOf(["activity_logs::retrieve"]);
    this.loadActivities();
  },
  data: () => ({
    search: "",
    activities: [],
    loading: false,
    viewedItem: {},
    viewDetails: false,
  }),
  computed: {
    headers() {
      const headers = [
        datatableColumn(
          this.$t("pages.activities.datatable.headers.supervisor"),
          "causer"
        ),

        datatableColumn(
          this.$t("pages.activities.datatable.headers.event"),
          "event"
        ),
        datatableColumn(
          this.$t("pages.activities.datatable.headers.description"),
          "description"
        ),
        datatableColumn(
          this.$t("pages.activities.datatable.headers.date"),
          "created_at"
        ),

        datatableColumn(
          this.$t("pages.activities.datatable.headers.extra"),
          "properties",
          () => true,
          {
            align:
              this.$t("direction").toLowerCase() == "rtl" ? "left" : "right",
          }
        ),
      ];
      return headers.filter((item) => {
        if (item) return true;
        return false;
      });
    },
  },
  methods: {
    async loadActivities() {
      this.loading = true;
      try {
        let response = await api.get("/logs/activities");
        response = response.data.data.reverse();
        this.activities = response;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style>
</style>