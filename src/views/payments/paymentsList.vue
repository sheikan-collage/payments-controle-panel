<template>
  <div>
    <v-card class="pa-0" flat>
      <v-card-title class="pa-0 ma-0 pb-2">
        <v-spacer></v-spacer>
        <v-btn
          large
          text
          @click="showControllers = !showControllers"
          icon
          v-if="editableFields"
        >
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
        <span class="mx-2"></span>
        <v-btn large text @click="showSearchBar = !showSearchBar" icon>
          <v-icon>mdi-magnify mdi-rotate-90</v-icon>
        </v-btn>
        <span class="mx-2"></span>
        <v-btn
          large
          :loading="loading"
          :disabled="loading"
          text
          @click="loadPayments"
          icon
        >
          <v-icon>mdi-refresh</v-icon>
          <!-- <span class="mx-2"></span>
          {{ $t("misc.refresh") }} -->
        </v-btn>
        <span class="mx-2"></span>
        <download-excel :data="payments" v-if="downloadable">
          <v-btn large color="success" icon>
            <v-icon>mdi-download</v-icon>
            <!-- <span class="mx-2"></span>
          {{ $t("misc.download") }} -->
          </v-btn>
        </download-excel>
      </v-card-title>
      <v-divider class="mb-2"></v-divider>
      <v-card-title class="" v-if="showSearchBar">
        <v-text-field
          outlined
          :placeholder="$t('components.search_field.placeholder')"
          v-model="search"
          :append-icon="`mdi-magnify ${
            $t('direction').toLowerCase() == 'rtl' ? 'mdi-rotate-90' : ''
          }`"
          :hide-details="true"
        ></v-text-field>
      </v-card-title>
      <v-card-title v-if="editableFields && showControllers">
        <v-chip-group multiples>
          <span
            class="ma-2"
            v-for="(validField, index) of validFields"
            :key="index"
            @click="toggleSelectedField(validField)"
          >
            <v-chip
              color="success"
              outlined
              active
              v-if="selectedFields.includes(validField)"
            >
              <v-icon>mdi-check</v-icon>
              <span class="mx-1"></span>
              {{ $t(`pages.students.datatable.headers.${validField}`) }}
            </v-chip>
            <v-chip v-else>
              {{ $t(`pages.students.datatable.headers.${validField}`) }}
            </v-chip>
          </span>
        </v-chip-group>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="studentsData"
          :loading="loading"
          :search="search"
          v-model="selectedStudents"
          item-key="id"
          :show-select="bulkAssign === true"
        >
          <template v-slot:[`item.university_id`]="{ item }">
            <v-hover v-slot="{ hover }" open-delay="200">
              <v-btn
                route
                :to="{ name: 'Students.show', params: { id: item.id } }"
                color="info"
                class="my-1 text-none"
                large
                :text="hover"
                :plain="!hover"
              >
                {{ item.university_id }}
                <span class="mx-2"></span>
                <v-icon v-show="hover">mdi-eye-outline</v-icon>
              </v-btn>
            </v-hover>
          </template>
          <template v-slot:[`item.payed_amount`]="{ item }">
            <span class="font-weight-black">{{
              item.payed_amount + " " + item.currency
            }}</span>
          </template>
          <template v-slot:[`item.created_at`]="{ item }">
            <relative-date :date="item.created_at" />
          </template>
          <template v-slot:[`item.fees_amount`]="{ item }">
            <span class="font-weight-black">{{
              item.fees_amount + " " + item.fees_currency
            }}</span>
          </template>

          <template v-slot:[`item.total_reductions`]="{ item }">
            <span class="font-weight-black">{{
              item.total_reductions + " " + item.fees_currency
            }}</span>
          </template>

          <template v-slot:[`item.is_active`]="{ item }">
            <v-chip outlined color="success" v-if="item.is_active">
              <v-icon color="success">mdi-radiobox-marked</v-icon>
              <span class="mx-1"></span>
              {{ $t("misc.active") }}</v-chip
            >
            <v-chip color="error" v-else>
              <v-icon color="white">mdi-stop-circle-outline</v-icon>
              <span class="mx-1"></span>
              {{ $t("misc.suspended") }}</v-chip
            >
          </template>

          <template v-slot:[`item.reductions_amount`]="{ item }">
            <span class="font-weight-black">{{
              item.reductions_percentage.toFixed(2) +
              "% (" +
              item.total_reductions.toFixed(2) +
              " " +
              item.fees.currency +
              " )"
            }}</span>
          </template>
          <template v-slot:[`item.installments_details`]="{ item }">
            <table
              border="1px"
              cellspacing="0"
              cellpadding="7"
              style="border-radius: 5px"
              @click="
                showInstallmentsAsPercentage = !showInstallmentsAsPercentage
              "
            >
              <tbody>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <tr
                      v-bind="attrs"
                      v-on="on"
                      v-if="showInstallmentsAsPercentage"
                    >
                      <td
                        v-for="(division, index) of item.installments.divisions"
                        :key="item.installments.id + division + index"
                      >
                        <span class="ma-2 font-weight-bold">
                          {{ division }}%
                        </span>
                      </td>
                    </tr>
                    <tr v-bind="attrs" v-on="on" v-else>
                      <td
                        v-for="(division, index) of item.installments.divisions"
                        :key="item.installments.id + division + index"
                      >
                        <span class="ma-2 font-weight-bold">
                          {{ ((division * item.total_bill) / 100).toFixed(2) }}
                        </span>
                      </td>
                      <td>
                        <span class="ma-2 font-weight-bold success--text">
                          {{ item.fees.currency }}
                        </span>
                      </td>
                    </tr>
                  </template>
                  <tr v-if="!showInstallmentsAsPercentage">
                    <td
                      v-for="(division, index) of item.installments.divisions"
                      :key="item.installments.id + division + index"
                    >
                      <span class="ma-2 font-weight-bold">
                        {{ division }}%
                      </span>
                    </td>
                  </tr>
                  <tr v-if="showInstallmentsAsPercentage">
                    <td
                      v-for="(division, index) of item.installments.divisions"
                      :key="item.installments.id + division + index"
                    >
                      <span class="ma-2 font-weight-bold">
                        {{ ((division * item.total_bill) / 100).toFixed(2) }}
                      </span>
                    </td>
                    <td>
                      <span class="ma-2 font-weight-bold success--text">
                        {{ item.fees.currency }}
                      </span>
                    </td>
                  </tr>
                </v-tooltip>
              </tbody>
            </table>
          </template>
          <template v-slot:[`item.total_bill`]="{ item }">
            <span class="font-weight-black">{{
              item.total_bill + " " + item.fees_currency
            }}</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import api from "@/api";
import { mainEventBus } from "@/main";
import RelativeDate from "@/components/RelativeDate.vue";

const allFields = [
  "university_id",
  "name",
  "payed_amount",
  "currency",
  "reference_id",
  "department",
  "batch",
  "level",
  "fees_name",
  "fees_amount",
  "fees_currency",
  "installments_name",
  "installments_details",
  "reductions_name",
  "reductions_amount",
  "total_bill",
  "total_reductions",
  "total_payed_amount",
  "remaining_payments_amount",
  "payments_count",
  "last_payment",
  "payed_progress",
  "is_active",
  "created_at",
  "updated_at",
];
export default {
  props: {
    bulkAssign: {
      type: Boolean,
      default: false,
    },
    downloadable: {
      type: Boolean,
      default: true,
    },
    editableFields: {
      type: Boolean,
      default: true,
    },
    apiEndPoint: {
      type: String,
      default: "/payments",
    },
    validFields: {
      type: Array,
      default: () => allFields,
    },
    fields: {
      type: Array,
      default: () => [
        "university_id",
        "name",
        "payed_amount",
        "currency",
        "reference_id",
        "department",
        "batch",
        "level",
        "created_at",
      ],
    },
  },
  components: { RelativeDate },
  created() {
    this.$permissions().authorize(["payments::retrieve"]);
    this.selectedFields = this.fields;
    if (this.selectedFields.length < 1) {
      this.selectedFields.push("university_id");
    }
    this.loadPayments();
    mainEventBus.$on("updateStudents", this.loadPayments);
  },
  data: () => ({
    search: null,
    loading: null,
    payments: [],
    selectedFields: [],
    selectedStudents: [],
    showControllers: false,
    showSearchBar: false,
    showInstallmentsAsPercentage: true,
  }),
  computed: {
    headers() {
      const headers = [];

      for (let field of allFields) {
        if (this.selectedFields.includes(field)) {
          headers.push({
            text: this.$t(`pages.payments.datatable.headers.${field}`),
            value: field,
          });
        }
      }
      if (headers.length > 1) {
        headers[headers.length - 1].align =
          this.$t("direction").toLowerCase() == "rtl" ? "left" : "right";
      }
      return headers;
    },
    studentsData() {
      const payments = [];
      for (let student of this.payments) {
        student.fees = student.fees_data;
        student.installments = student.installments_data;
        student.reductions = student.reductions_data;
        student.is_active = student.student.is_active;

        student.fees_name = student.fees.name;
        student.fees_amount = student.fees.amount;
        student.fees_currency = student.fees.currency;
        student.installments_name = student.installments.name;
        student.installments_details = student.installments.divisions;
        student.reductions_name = student.reductions.name;
        student.reductions_amount = student.reductions.amount;
        student.total_payed_amount = 0;
        student.remaining_payments_amount = 0;
        student.payments_count = 0;
        student.last_payment = 0;
        student.payed_progress = 0;

        //calculate reductions
        if (student.reductions.is_percentage) {
          student.total_reductions =
            (student.reductions.amount * student.fees.amount) / 100;
          student.reductions_percentage = student.reductions.amount;
        } else {
          student.reductions_percentage =
            (student.reductions.amount * 100) / student.fees.amount;
          student.total_reductions = student.reductions.amount;
        }

        student.total_bill =
          Number(student.fees.amount) - Number(student.total_reductions);
        payments.push(student);
      }
      return payments;
    },
  },
  methods: {
    toggleSelectedField(field) {
      if (
        this.selectedFields.includes(field) &&
        this.selectedFields.length > 1
      ) {
        this.selectedFields.splice(this.selectedFields.indexOf(field), 1);
      } else this.selectedFields.push(field);
    },
    async loadPayments() {
      if (this.loading) return false;
      this.loading = true;
      try {
        const response = await api.get(this.apiEndPoint);
        console.log(response.data.data);
        const payments = response.data.data.reverse();

        this.payments = payments;
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