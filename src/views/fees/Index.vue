<template>
  <div>
    <router-view></router-view>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">{{ $t("pages.fees.title") }}</h2>
            <p class="my-2">{{ $t("pages.fees.subtitle") }}</p>
          </div>
          <add-form-route :has="['fees::add']" routeName="Fees.create" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <protected-view :has="['fees::retrieve']">
          <fees-list />
        </protected-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddFormRoute from "../../components/AddFormRoute.vue";
import FeesList from './feesList.vue';
export default {
  components: { AddFormRoute, FeesList },
  async created() {
    this.$permissions().authorizeOneOf([
      "fees::add",
      "fees::remove",
      "fees::retrieve",
      "fees::update",
    ]);
    await this.loadFees();
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
        "fees::add",
        "fees::remove",
        "fees::retrieve",
        "fees::update",
      ];
      this.$permissions().authorizeOneOf(permissions);
    },
    async loadFees() {},
  },
};
</script>

<style></style>
