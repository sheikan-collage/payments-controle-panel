<template>
  <v-card flat :disabled="loading" >
    <v-card-title class="d-inline-block mt-4">
      <v-row >
        <v-col>
          <v-text-field
            type="text"
            :placeholder="$t('pages.create_fees.form.name.placeholder')"
            :label="$t('pages.create_fees.form.name.label')"
            v-model="name"
            outlined
            :error-messages="nameErrors"
            :hide-details="nameErrors.length < 1"
            
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
            :hide-details="amountErrors.length < 1"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            :items="validCurrencies"
            :label="$t('pages.create_fees.form.currency.label')"
            :placeholder="$t('pages.create_fees.form.currency.placeholder')"
            outlined
            v-model="currency"
            :error-messages="currencyErrors"
            :hide-details="currencyErrors.length < 1"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-actions class="pa-2">
      <span class="mx-2"></span>
      <v-btn large color="primary" :loading="loading" @click="save">
        <v-icon>mdi-content-save</v-icon>
        <span class="mx-2"></span>
        <span>{{ $t("pages.create_role.form.save") }}</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import api from "@/api";
import responseCodes from "@/api/responseCodes";
import { mainEventBus } from "@/main";
export default {
  props: {
    fees: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  components: {},
  created() {
    this.$permissions().authorizeOneOf(["fees::update"]);
    this.name = this.fees.name;
    this.amount = this.fees.amount;
    this.currency = this.fees.currency;
  },
  data() {
    return {
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
        const response = await api.put(`/fees/${this.fees.id}`, {
          name: this.name,
          amount: this.amount,
          currency: this.currency,
        });
        mainEventBus.$emit("updateFees", response.data.data);
        this.$emit("updated", response.data.data);
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

<style>
</style>