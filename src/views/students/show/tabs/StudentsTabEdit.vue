<template>
  <v-card width="1000" flat :disabled="loading">
    <v-card-title class="d-inline-block">
      <v-row class="my-0 py-0">
        <v-col>
          <v-text-field
            type="text"
            :placeholder="$t('pages.create_student.form.name.placeholder')"
            :label="$t('pages.create_student.form.name.label')"
            v-model="name"
            outlined
            :error-messages="nameErrors"
            :hide-details="nameErrors.length < 1"
            block
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="my-0">
        <v-col>
          <v-text-field
            type="number"
            :min="1"
            :step="1"
            :placeholder="
              $t('pages.create_student.form.university_id.placeholder')
            "
            :label="$t('pages.create_student.form.university_id.label')"
            v-model="university_id"
            outlined
            :error-messages="universityIdErrors"
            :hide-details="universityIdErrors.length < 1"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            type="text"
            :placeholder="
              $t('pages.create_student.form.department.placeholder')
            "
            :label="$t('pages.create_student.form.department.label')"
            v-model="department"
            outlined
            :error-messages="departmentErrors"
            :hide-details="departmentErrors.length < 1"
            block
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="my-0">
        <v-col>
          <v-text-field
            type="text"
            :placeholder="$t('pages.create_student.form.level.placeholder')"
            :label="$t('pages.create_student.form.level.label')"
            v-model="level"
            outlined
            :error-messages="levelErrors"
            :hide-details="levelErrors.length < 1"
            block
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            type="text"
            :placeholder="$t('pages.create_student.form.batch.placeholder')"
            :label="$t('pages.create_student.form.batch.label')"
            v-model="batch"
            outlined
            :error-messages="batchErrors"
            :hide-details="batchErrors.length < 1"
            block
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="my-0">
        <v-col>
          <v-select
            :items="fees"
            :label="$t('pages.create_student.form.fees.label')"
            :placeholder="$t('pages.create_student.form.fees.placeholder')"
            :hint="feesHint"
            persistent-hint
            outlined
            v-model="fees_id"
            :error-messages="feesErrors"
            item-text="name"
            item-value="id"
            :hide-details="feesErrors.length < 1 && feesHint.trim() == ''"
            :loading="loadingFees"
          >
            <template v-slot:selection="{ item }">
              <span>{{ item.name }}</span>

              <span class="font-weight-bold mx-2"
                >({{ item.amount + " " + item.currency }})</span
              >
            </template>
            <template v-slot:item="{ item, attrs, on }">
              <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row no-gutters align="center">
                      <span>{{ item.name }}</span>
                      <v-spacer></v-spacer>
                      <v-chip color="success">
                        <span class="font-weight-bold">{{
                          item.amount + " " + item.currency
                        }}</span>
                      </v-chip>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col>
          <v-select
            :items="installments"
            :label="$t('pages.create_student.form.installments.label')"
            :placeholder="
              $t('pages.create_student.form.installments.placeholder')
            "
            outlined
            v-model="installments_id"
            :error-messages="installmentsErrors"
            :hide-details="
              installmentsErrors.length < 1 && installmentsHint.trim() == ''
            "
            :hint="installmentsHint"
            persistent-hint
            item-text="name"
            item-value="id"
            :loading="loadingInstallments"
          >
            <template v-slot:selection="{ item }">
              <span>{{ item.name }}</span>

              <span class="font-weight-bold mx-2">
                ({{ item.divisions.join("%, ") }}%)
              </span>
            </template>
            <template v-slot:item="{ item, attrs, on }">
              <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row no-gutters align="center">
                      <span>{{ item.name }}</span>
                      <v-spacer></v-spacer>
                      <v-chip color="success" outlined>
                        <span class="font-weight-bold"
                          >{{ item.divisions.join("% | ") }}%</span
                        >
                      </v-chip>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row class="my-0">
        <v-col>
          <v-select
            :items="reductions"
            :label="$t('pages.create_student.form.reductions.label')"
            :placeholder="
              $t('pages.create_student.form.reductions.placeholder')
            "
            outlined
            v-model="reductions_id"
            :error-messages="reductionsErrors"
            :hide-details="
              reductionsErrors.length < 1 && reductionsHint.trim() == ''
            "
            :hint="reductionsHint"
            persistent-hint
            item-text="name"
            item-value="id"
            :loading="loadingReductions"
          >
            <template v-slot:selection="{ item }">
              <span>{{ item.name }}</span>

              <span class="font-weight-bold mx-2">
                (
                {{ item.amount }}
                <v-icon
                  size="20"
                  v-text="
                    item.is_percentage ? 'mdi-percent' : 'mdi-currency-usd'
                  "
                  color="black"
                ></v-icon>
                )
              </span>
            </template>
            <template v-slot:item="{ item, attrs, on }">
              <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row no-gutters align="center">
                      <span>{{ item.name }}</span>
                      <v-spacer></v-spacer>
                      <v-chip
                        :color="item.is_percentage ? 'success' : 'secondary'"
                      >
                        <span class="font-weight-bold">{{ item.amount }}</span>
                        <v-icon
                          size="20"
                          v-text="
                            item.is_percentage
                              ? 'mdi-percent'
                              : 'mdi-currency-usd'
                          "
                        ></v-icon>
                      </v-chip>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col>
          <v-select
            :items="validActivationStatuses"
            :label="$t('pages.create_student.form.activate.label')"
            :placeholder="$t('pages.create_student.form.activate.placeholder')"
            outlined
            v-model="is_active"
            :error-messages="activationErrors"
            :hide-details="activationErrors.length < 1"
            item-text="text"
            item-value="value"
            :append-icon="
              is_active === true
                ? 'mdi-radiobox-marked'
                : is_active === false
                ? 'mdi-stop-circle-outline'
                : ''
            "
          >
          </v-select>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-actions class="pa-2">
      <v-btn large color="primary" :loading="loading" @click="save">
        <v-icon>mdi-content-save</v-icon>
        <span class="mx-2"></span>
        <span>{{ $t("misc.save") }}</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import api from "@/api";
import responseCodes from "@/api/responseCodes";
import { mainEventBus } from "@/main";
export default {
  components: {},
  props: {
    student: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  created() {
    this.$permissions().authorizeOneOf(["students::add"]);
    this.loadFees();
    this.loadInstallments();
    this.loadReductions();
    this.name = this.student.name;
    this.university_id = this.student.university_id;
    this.department = this.student.department;
    this.level = this.student.level;
    this.batch = this.student.batch;
    this.fees_id = this.student.fees_id;
    this.installments_id = this.student.installments_id;
    this.reductions_id = this.student.reductions_id;
    this.is_active = this.student.is_active;
  },
  data() {
    return {
      dialog: true,
      name: null,
      university_id: null,
      department: null,
      level: null,
      batch: null,
      fees_id: null,
      installments_id: null,
      reductions_id: null,
      is_active: null,
      nameErrors: [],
      universityIdErrors: [],
      departmentErrors: [],
      levelErrors: [],
      batchErrors: [],
      feesErrors: [],
      installmentsErrors: [],
      reductionsErrors: [],
      activationErrors: [],
      loading: false,
      loadingFees: false,
      loadingInstallments: false,
      loadingReductions: false,
      fees: [],
      installments: [],
      reductions: [],
    };
  },
  computed: {
    validActivationStatuses() {
      const statuses = [
        {
          text: this.$t("pages.create_student.form.activate.statuses.active"),
          value: true,
        },
        {
          text: this.$t(
            "pages.create_student.form.activate.statuses.suspended"
          ),
          value: false,
        },
      ];
      return statuses;
    },
    selectedFees() {
      if (this.fees_id) {
        for (let fees of this.fees) {
          if (fees.id == this.fees_id) {
            return fees;
          }
        }
      }
      return null;
    },
    selectedInstallments() {
      if (this.installments_id) {
        for (let installments of this.installments) {
          if (installments.id == this.installments_id) {
            return installments;
          }
        }
      }
      return null;
    },
    selectedReductions() {
      if (this.reductions_id) {
        for (let reductions of this.reductions) {
          if (reductions.id == this.reductions_id) {
            return reductions;
          }
        }
      }
      return null;
    },
    reductionsHint() {
      if (!this.selectedReductions || !this.selectedFees) {
        return "";
      }
      if (this.selectedReductions.is_percentage) {
        return (
          (
            (this.selectedReductions.amount * this.selectedFees.amount) /
            100
          ).toFixed(2) +
          " " +
          this.selectedFees.currency
        );
      }
      return (
        (
          (this.selectedReductions.amount * 100) /
          this.selectedFees.amount
        ).toFixed(2) + " %"
      );
    },
    feesHint() {
      if (!this.selectedReductions || !this.selectedFees) {
        return "";
      }
      let reductionsAmount;
      if (this.selectedReductions.is_percentage) {
        reductionsAmount =
          (this.selectedReductions.amount * this.selectedFees.amount) / 100;
      } else {
        reductionsAmount = this.selectedReductions.amount;
      }
      const total_bill =
        Number(this.selectedFees.amount) - Number(reductionsAmount);
      return (
        Number(this.selectedFees.amount) +
        " - " +
        Number(reductionsAmount) +
        " = " +
        total_bill.toFixed(2) +
        " " +
        this.selectedFees.currency
      );
    },
    installmentsHint() {
      if (!this.selectedInstallments || !this.selectedFees) {
        return "";
      }
      const values = [];
      let feesAmount = this.selectedFees.amount;
      if (this.selectedReductions) {
        if (this.selectedReductions.is_percentage) {
          feesAmount -=
            (this.selectedReductions.amount * this.selectedFees.amount) / 100;
        } else {
          feesAmount -= this.selectedReductions.amount;
        }
      }
      for (let division of this.selectedInstallments.divisions) {
        values.push(((division * feesAmount) / 100).toFixed(2));
      }
      return "( " + values.join(" | ") + " ) " + this.selectedFees.currency;
    },
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async loadFees() {
      if (this.loadingFees) return false;
      this.loadingFees = true;

      let response = await api.get("/fees");
      this.fees = response.data.data.reverse();

      this.loadingFees = false;
    },
    async loadInstallments() {
      if (this.loadingInstallments) return false;
      this.loadingInstallments = true;

      let response = await api.get("/installments");
      this.installments = response.data.data.reverse();

      this.loadingInstallments = false;
    },
    async loadReductions() {
      if (this.loadingReductions) return false;
      this.loadingReductions = true;

      let response = await api.get("/reductions");
      this.reductions = response.data.data.reverse();

      this.loadingReductions = false;
    },
    async save() {
      if (this.loading) return;
      this.nameErrors = [];
      this.universityIdErrors = [];
      this.departmentErrors = [];
      this.levelErrors = [];
      this.batchErrors = [];
      this.feesErrors = [];
      this.installmentsErrors = [];
      this.reductionsErrors = [];
      this.activationErrors = [];

      if (!this.name || this.name.trim() == "") {
        this.nameErrors.push(
          this.$t("pages.create_student.form.name.errors.empty")
        );
        return;
      }
      if (!this.university_id || this.university_id < 1) {
        this.universityIdErrors.push(
          this.$t("pages.create_student.form.university_id.errors.empty")
        );
        return;
      }

      if (!this.selectedFees || !this.fees_id) {
        this.feesErrors.push(
          this.$t("pages.create_student.form.fees.errors.empty")
        );
        return;
      }

      if (!this.selectedInstallments || !this.installments_id) {
        this.installmentsErrors.push(
          this.$t("pages.create_student.form.installments.errors.empty")
        );
        return;
      }

      if (!this.selectedReductions || !this.reductions_id) {
        this.reductionsErrors.push(
          this.$t("pages.create_student.form.reductions.errors.empty")
        );
        return;
      }

      if (typeof this.is_active !== "boolean") {
        this.activationErrors.push(
          this.$t("pages.create_student.form.activate.errors.empty")
        );
        return;
      }

      this.loading = true;
      try {
        const response = await api.put(`/students/${this.student.id}`, {
          name: this.name,
          university_id: this.university_id,
          level: this.level,
          department: this.department,
          batch: this.batch,
          fees_id: this.fees_id,
          installments_id: this.installments_id,
          reductions_id: this.reductions_id,
          is_active: this.is_active,
        });
        mainEventBus.$emit("updateStudents", response.data.data);
      } catch (error) {
        if (
          error.response &&
          error.response.status == responseCodes.HTTP_UNPROCESSABLE_ENTITY
        ) {
          if (error.response.data.errors.name)
            this.nameErrors = error.response.data.errors.name;
          if (error.response.data.errors.university_id)
            this.universityIdErrors = error.response.data.errors.university_id;
          if (error.response.data.errors.department)
            this.departmentErrors = error.response.data.errors.department;
          if (error.response.data.errors.level)
            this.levelErrors = error.response.data.errors.level;
          if (error.response.data.errors.batch)
            this.batchErrors = error.response.data.errors.batch;
          if (error.response.data.errors.fees_id)
            this.feesErrors = error.response.data.errors.fees_id;
          if (error.response.data.errors.installments_id)
            this.installmentsErrors =
              error.response.data.errors.installments_id;
          if (error.response.data.errors.reductions_id)
            this.reductionsErrors = error.response.data.errors.reductions_id;
          if (error.response.data.errors.is_active)
            this.activationErrors = error.response.data.errors.is_active;
        } else alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
