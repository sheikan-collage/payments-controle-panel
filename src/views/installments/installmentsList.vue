<template>
  <v-card class="pa-1" flat>
    <v-card-text>
      <search-field v-model="search" />

      <v-data-table
        :headers="headers"
        :items="installments"
        :loading="loading"
        :search="search"
      >
        <template v-slot:[`item.name`]="{ item }">
          <v-hover v-slot="{ hover }" open-delay="200">
            <v-btn
              route
              :to="{ name: 'Installments.show', params: { id: item.id } }"
              :outlined="hover"
              color="info"
              class="my-1 text-none"
              large
              :text="!hover"
            >
              {{ item.name }}
              <span class="mx-2"></span>
              <v-icon v-show="hover">mdi-eye-outline</v-icon>
            </v-btn>
          </v-hover>
        </template>
        <template v-slot:[`item.divisions`]="{ item }">
          <table
            border="1px"
            cellspacing="0"
            cellpadding="7"
            style="border-radius: 5px"
          >
            <tbody>
              <tr>
                <td
                  v-for="(division, index) of item.divisions"
                  :key="'division_' + division + index"
                >
                  <span class="ma-2 font-weight-bold"> {{ division }}% </span>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-slot:[`item.students_count`]="{ item }">
          <span class="mx-2 font-weight-bold">{{ item.students_count }}</span>
          <v-icon>mdi-account-group-outline</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
  
<script>
import api from "@/api";
import { datatableColumn } from "@/components/ListDataTable.vue";
import { mainEventBus } from "../../main";
import SearchField from "@/components/searchField.vue";

export default {
  components: {
    SearchField,
  },
  data() {
    return {
      installments: [],
      loading: false,
      search: "",
    };
  },
  computed: {
    headers() {
      const headers = [
        datatableColumn(
          this.$t("pages.installments.datatable.headers.name"),
          "name"
        ),
        datatableColumn(
          this.$t("pages.installments.datatable.headers.divisions"),
          "divisions"
        ),

        datatableColumn(
          this.$t("pages.installments.datatable.headers.students_count"),
          "students_count",
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
  async created() {
    this.$permissions().authorizeOneOf(["installments::retrieve"]);
    mainEventBus.$on("updateInstallments", this.loadInstallments);

    await this.loadInstallments();
  },
  methods: {
    async loadInstallments() {
      if (this.loading) return false;
      this.loading = true;

      const response = await api.get("/installments");
      this.installments = response.data.data.reverse();

      console.log(this.installments);

      this.loading = false;
    },
  },
};
</script>
  
  <style></style>
  