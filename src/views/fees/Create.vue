<template>
  <v-dialog width="800" scrollable persistent :value="true">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>
        <p class="headline">{{ $t("pages.create_fees.title") }}</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="goBack">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-title class="d-inline-block">
        <v-row class="my-0 py-0">
          <v-col>
            <v-text-field
              type="text"
              :placeholder="$t('pages.create_fees.form.name.placeholder')"
              :label="$t('pages.create_fees.form.name.label')"
              v-model="name"
              outlined
              :error-messages="nameErrors"
              :hide-details="nameErrors.length < 1"
              block
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              type="number"
              :min="1"
              :step="1"
              :placeholder="$t('pages.create_fees.form.amount.placeholder')"
              :label="$t('pages.create_fees.form.amount.label')"
              v-model="amount"
              outlined
              :error-messages="amountErrors"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              :items="validCurrencies"
              :label="$t('pages.create_fees.form.currency.label')"
              :placeholder="$t('pages.create_fees.form.currency.placeholder')"
              outlined
              v-model="currency"
              :error-messages="currencyErrors"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>

      <v-divider class=""></v-divider>
      <v-card-actions class="pa-2">
        <v-spacer></v-spacer>

        <v-btn text large color="error" @click="goBack">
          <v-icon>mdi-cancel</v-icon>
          <span class="mx-1"></span>
          <span>{{ $t("pages.create_role.form.cancel") }}</span>
        </v-btn>
        <span class="mx-2"></span>
        <v-btn large color="primary" :loading="loading" @click="save">
          <v-icon>mdi-content-save</v-icon>
          <span class="mx-2"></span>
          <span>{{ $t("pages.create_role.form.save") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "@/api";
import responseCodes from "../../api/responseCodes";
import { mainEventBus } from "../../main";
export default {
  components: {},
  created() {
    this.$permissions().authorizeOneOf(["fees::add"]);
  },
  data() {
    return {
      dialog: true,
      name: "",
      amount: null,
      currency: null,
      nameErrors: [],
      amountErrors: [],
      currencyErrors: [],
      validCurrencies: ["SDG", "USD"],
      loading: false,
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async save() {
      if (this.loading) return;
      this.nameErrors = [];
      this.amountErrors = [];

      if (this.name.trim() == "") {
        this.nameErrors.push(
          this.$t("pages.create_fees.form.name.errors.empty")
        );
        return;
      }

      if (!this.amount || isNaN(this.amount) || this.amount < 1) {
        this.amountErrors.push(
          this.$t("pages.create_fees.form.amount.errors.empty")
        );
        return;
      }

      if (!this.currency || !this.validCurrencies.includes(this.currency)) {
        this.currencyErrors.push(
          this.$t("pages.create_fees.form.currency.errors.empty")
        );
        return;
      }

      this.amount = Number(this.amount);

      this.loading = true;
      try {
        const response = await api.post("/fees", {
          name: this.name,
          amount: this.amount,
          currency: this.currency,
        });
        mainEventBus.$emit("updateFees", response.data.data);
        this.goBack();
      } catch (error) {
        if (
          error.response &&
          error.response.status == responseCodes.HTTP_UNPROCESSABLE_ENTITY
        ) {
          if (error.response.data.errors.name)
            this.nameErrors = error.response.data.errors.name;
          if (error.response.data.errors.amount)
            this.amountErrors = error.response.data.errors.amount;
          if (error.response.data.errors.currency)
            this.currencyErrors = error.response.data.errors.currency;
        } else alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
