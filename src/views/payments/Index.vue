<template>
  <div>
    <router-view></router-view>
    <v-row>
      <v-col>
        <h2 class="display-2">{{ $t("pages.payments.title") }}</h2>
        <p class="my-2">{{ $t("pages.payments.subtitle") }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <payments-list />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PaymentsList from "./paymentsList.vue";

export default {
  components: { PaymentsList },
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
