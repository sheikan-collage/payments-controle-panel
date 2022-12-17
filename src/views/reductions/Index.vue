<template>
  <div>
    <router-view></router-view>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">{{ $t("pages.reductions.title") }}</h2>
            <p class="my-2">{{ $t("pages.reductions.subtitle") }}</p>
          </div>
          <add-form-route :has="['reductions::add']" routeName="Reductions.create" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <protected-view :has="['reductions::retrieve']">
          <reductions-list />
        </protected-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddFormRoute from "../../components/AddFormRoute.vue";
import ReductionsList from './reductionsList.vue';
export default {
  components: { AddFormRoute, ReductionsList },
  async created() {
    this.$permissions().authorizeOneOf([
      "reductions::add",
      "reductions::remove",
      "reductions::retrieve",
      "reductions::update",
    ]);
    await this.loadReductions();
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
        "reductions::add",
        "reductions::remove",
        "reductions::retrieve",
        "reductions::update",
      ];
      this.$permissions().authorizeOneOf(permissions);
    },
    async loadReductions() {},
  },
};
</script>

<style></style>
