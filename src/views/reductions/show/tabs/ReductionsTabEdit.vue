<template>
  <v-card :disabled="loading" width="800" flat>
    <v-card-title class="d-inline-block">
      <v-row class="my-0 py-0">
        <v-col>
          <v-text-field
            type="text"
            :placeholder="$t('pages.create_reductions.form.name.placeholder')"
            :label="$t('pages.create_reductions.form.name.label')"
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
            :placeholder="$t('pages.create_reductions.form.amount.placeholder')"
            :label="$t('pages.create_reductions.form.amount.label')"
            v-model="amount"
            outlined
            :error-messages="amountErrors"
            :append-icon="
              is_percentage === true
                ? 'mdi-percent'
                : is_percentage === false
                ? 'mdi-currency-usd'
                : ''
            "
            :hide-details="amountErrors.length < 1"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="my-0">
        <v-col>
          <v-select
            :items="validTypes"
            :label="$t('pages.create_reductions.form.type.label')"
            :placeholder="$t('pages.create_reductions.form.type.placeholder')"
            outlined
            v-model="is_percentage"
            :error-messages="typeErrors"
            item-text="text"
            item-value="value"
            :append-icon="
              is_percentage === true
                ? 'mdi-percent'
                : is_percentage === false
                ? 'mdi-currency-usd'
                : ''
            "
            :hide-details="typeErrors.length < 1"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-actions class="pa-2">
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
  components: {},
  props: {
    reductions: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  created() {
    this.$permissions().authorizeOneOf(["reductions::update"]);
    this.name = this.reductions.name;
    this.amount = this.reductions.amount;
    this.is_percentage = this.reductions.is_percentage;
  },
  data() {
    return {
      dialog: true,
      name: "",
      amount: null,
      is_percentage: null,
      nameErrors: [],
      amountErrors: [],
      typeErrors: [],
      loading: false,
    };
  },
  computed: {
    validTypes() {
      const types = [
        {
          text: this.$t("pages.create_reductions.form.type.types.percentage"),
          value: true,
        },
        {
          text: this.$t("pages.create_reductions.form.type.types.exact_amount"),
          value: false,
        },
      ];
      return types;
    },
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async save() {
      if (this.loading) return;
      this.nameErrors = [];
      this.amountErrors = [];
      this.typeErrors = [];

      if (this.name.trim() == "") {
        this.nameErrors.push(
          this.$t("pages.create_reductions.form.name.errors.empty")
        );
        return;
      }

      if (!this.amount || isNaN(this.amount) || this.amount < 1) {
        this.amountErrors.push(
          this.$t("pages.create_reductions.form.amount.errors.empty")
        );
        return;
      }

      if (typeof this.is_percentage !== "boolean") {
        this.typeErrors.push(
          this.$t("pages.create_reductions.form.type.errors.empty")
        );
        return;
      }

      this.amount = Number(this.amount);

      this.loading = true;
      try {
        const response = await api.put(`/reductions/${this.reductions.id}`, {
          name: this.name,
          amount: this.amount,
          is_percentage: this.is_percentage,
        });
        mainEventBus.$emit("updateReductions", response.data.data);
      } catch (error) {
        if (
          error.response &&
          error.response.status == responseCodes.HTTP_UNPROCESSABLE_ENTITY
        ) {
          if (error.response.data.errors.name)
            this.nameErrors = error.response.data.errors.name;
          if (error.response.data.errors.amount)
            this.amountErrors = error.response.data.errors.amount;
          if (error.response.data.errors.is_percentage)
            this.typeErrors = error.response.data.errors.is_percentage;
        } else alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
