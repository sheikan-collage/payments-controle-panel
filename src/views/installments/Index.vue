<template>
  <div>
    <router-view></router-view>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">{{ $t("pages.installments.title") }}</h2>
            <p class="my-2">{{ $t("pages.installments.subtitle") }}</p>
          </div>
          <add-form-route
            :has="['installments::add']"
            routeName="Installments.create"
          />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <protected-view :has="['installments::retrieve']">
          <installments-list />
        </protected-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddFormRoute from "../../components/AddFormRoute.vue";
import InstallmentsList from "./installmentsList.vue";
export default {
  components: { AddFormRoute, InstallmentsList },
  async created() {
    this.$permissions().authorizeOneOf([
      "installments::add",
      "installments::remove",
      "installments::retrieve",
      "installments::update",
    ]);
    await this.loadInstallments();
  },
  data() {
    return {
      filterQuery: "",
    };
  },
  mounted() {
    // this.authorize();
  },
  methods: {
    authorize() {
      const permissions = [
        "installments::add",
        "installments::remove",
        "installments::retrieve",
        "installments::update",
      ];
      this.$permissions().authorizeOneOf(permissions);
    },
    async loadInstallments() {},
  },
};
</script>

<style></style>
