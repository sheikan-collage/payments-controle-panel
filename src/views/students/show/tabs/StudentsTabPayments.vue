<template>
  <div>
    <h1>Student Tab Payments</h1>
    <v-data-table :headers="headers" :items="payments" :loading="loading">
      <template v-slot:[`item.payed_amount`]="{ item }">
        <span class="font-weight-black">{{
          item.payed_amount + " " + item.currency
        }}</span>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <relative-date :date="item.created_at" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "@/api";
import { datatableColumn } from "@/components/ListDataTable.vue";
import RelativeDate from '@/components/RelativeDate.vue';

export default {
  components: { RelativeDate },
  props: {
    student: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  async created() {
    this.$permissions().authorize(["payments::retrieve"]);
    await this.loadStudentPayments();
  },
  data() {
    return {
      loading: false,
      payments: [],
    };
  },
  computed: {
    headers() {
      const headers = [
        datatableColumn("Date time", "created_at"),
        datatableColumn(
          this.$t("pages.fees.datatable.headers.amount"),
          "payed_amount"
        ),
        datatableColumn("Currency", "currency"),

        datatableColumn("Reference ID", "reference_id", () => true, {
          align: this.$t("direction").toLowerCase() == "rtl" ? "left" : "right",
        }),
      ];
      return headers.filter((item) => {
        if (item) return true;
        return false;
      });
    },
  },
  methods: {
    async loadStudentPayments() {
      const id = this.$route.params.id;
      this.loading = true;

      try {
        const response = await api.get(`/students/${id}/payments`);
        this.payments = response.data.data.reverse();
      } catch (error) {
        console.log(error);
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style>
</style>