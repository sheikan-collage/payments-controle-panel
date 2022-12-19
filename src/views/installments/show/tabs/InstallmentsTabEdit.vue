<template>
  <v-card :loading="loading" :disabled="loading" width="1000" flat>
    <v-card-title class="d-inline-block">
      <v-row class="my-0 py-0">
        <v-col>
          <v-text-field
            type="text"
            :placeholder="$t('pages.create_installments.form.name.placeholder')"
            :label="$t('pages.create_installments.form.name.label')"
            v-model="name"
            outlined
            :error-messages="nameErrors"
            :hide-details="nameErrors.length < 1"
            block
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="my-0">
        <v-col class="my-0">
          <v-checkbox
            v-model="autoAdjust"
            :label="$t('pages.create_installments.form.divisions.auto_adjust')"
            :hide-details="true"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row class="my-0">
        <v-col
          v-for="(division, index) of divisions"
          :key="'new_division_' + index"
        >
          <v-text-field
            type="number"
            :min="1"
            :step="1"
            :placeholder="
              $t('pages.create_installments.form.divisions.placeholder')
            "
            suffix=" % "
            v-model="divisions[index]"
            outlined
            :error="divisionsErrors.length > 0"
            :append-icon="focusedDivision == index ? 'mdi-delete' : ''"
            @focus="
              if (divisions.length > 2) {
                focusedDivision = index;
              }
            "
            @blur="focusedDivision = -1"
            @click:append="removeDivision(index)"
            :hide-details="true"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="addNewDivision" block x-large
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-col>
      </v-row>
      <v-row v-if="divisionsErrors.length > 0">
        <v-col>
          <v-alert type="error" outlined prominent>
            {{ $t("pages.create_installments.form.divisions.errors.invalid") }}
          </v-alert>
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
    installments: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  created() {
    this.$permissions().authorizeOneOf(["installments::add"]);
    this.name = this.installments.name;
    this.divisions = this.installments.divisions;
  },
  data() {
    return {
      dialog: true,
      name: "",
      divisions: [50, 50],
      nameErrors: [],
      divisionsErrors: [],
      loading: false,
      autoAdjust: true,
      focusedDivision: -1,
    };
  },
  computed: {
    divisionsSum() {
      let sum = 0;
      for (let division of this.divisions) {
        sum += Number(division);
      }
      return sum;
    },
  },
  methods: {
    goBack() {
      window.history.back();
    },
    addNewDivision() {
      let val = null;
      const lastValue = Number(this.divisions[this.divisions.length - 1]);
      if (this.autoAdjust && lastValue) {
        console.log("last value", lastValue);
        console.log("sum", this.divisionsSum);
        val = Math.floor((lastValue + 100 - Number(this.divisionsSum)) / 2);
        console.log(val);
        this.divisions[this.divisions.length - 1] = Math.ceil(
          (lastValue + 100 - Number(this.divisionsSum)) / 2
        );
      }

      this.divisions.push(val);
      console.log(this.divisions);
    },
    removeDivision(index) {
      const val = Number(this.divisions[index]);
      if (this.autoAdjust) {
        if (this.divisions[index - 1]) {
          this.divisions[index - 1] += val;
        } else {
          this.divisions[index + 1] += val;
        }
      }
      this.divisions.splice(index, 1);
      this.focusedDivision = -1;
    },
    validateDivisions() {
      this.divisionsErrors = [];
      let sum = 0;
      for (let division of this.divisions) {
        division = Number(division);
        if (division < 1) {
          this.divisionsErrors.push(
            this.$t("pages.create_installments.form.divisions.errors.invalid")
          );
          return false;
        }
        sum += division;
      }
      if (sum != 100) {
        this.divisionsErrors.push(
          this.$t("pages.create_installments.form.divisions.errors.invalid")
        );
        return false;
      }
      return true;
    },
    async save() {
      if (this.loading) return;
      this.nameErrors = [];
      this.divisionsErrors = [];

      if (this.name.trim() == "") {
        this.nameErrors.push(
          this.$t("pages.create_installments.form.name.errors.empty")
        );
        return;
      }

      if (!this.validateDivisions()) {
        return;
      }

      this.loading = true;
      try {
        const response = await api.put(
          `/installments/${this.installments.id}`,
          {
            name: this.name,
            divisions: this.divisions,
          }
        );
        mainEventBus.$emit("updateInstallments", response.data);
        
      } catch (error) {
        if (
          error.response &&
          error.response.status == responseCodes.HTTP_UNPROCESSABLE_ENTITY
        ) {
          if (error.response.data.errors.name)
            this.nameErrors = error.response.data.errors.name;
          if (error.response.data.errors.divisions)
            this.divisionsErrors = error.response.data.errors.divisions;
        } else alert(error);
      }
      this.loading = false;
    },
  },
  watch: {
    divisions() {
      this.validateDivisions();
    },
  },
};
</script>

<style>
</style>
