<template>
  <v-card class="pa-1" flat>
    <v-card-text>
      <search-field v-model="search" />

      <v-data-table
        :headers="headers"
        :items="fees"
        :loading="loading"
        :search="search"
      >
        <template v-slot:[`item.name`]="{ item }">
          <v-hover v-slot="{ hover }" open-delay="200">
            <v-btn
              route
              :to="{ name: 'Fees.show', params: { id: item.id } }"
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
        <template v-slot:[`item.amount`]="{ item }">
          <span class="font-weight-bold">{{
            item.amount + " " + item.currency
          }}</span>
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
      fees: [],
      loading: false,
      search: "",
    };
  },
  computed: {
    headers() {
      const headers = [
        datatableColumn(this.$t("pages.fees.datatable.headers.name"), "name"),
        datatableColumn(
          this.$t("pages.fees.datatable.headers.currency"),
          "currency"
        ),
        datatableColumn(
          this.$t("pages.fees.datatable.headers.amount"),
          "amount"
        ),

        datatableColumn(
          this.$t("pages.fees.datatable.headers.students_count"),
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
    this.$permissions().authorizeOneOf(["fees::retrieve"]);
    mainEventBus.$on("updateFees", this.loadFees);

    await this.loadFees();
  },
  methods: {
    async loadFees() {
      if(this.loading) return false;
      this.loading = true;

      const response = await api.get("/fees");
      this.fees = response.data.data.reverse();

      console.log(this.fees);

      this.loading = false;
    },
  },
};
</script>
  
  <style></style>
  