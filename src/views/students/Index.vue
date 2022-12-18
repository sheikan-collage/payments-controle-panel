<template>
  <div>
    <router-view></router-view>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">{{ $t("pages.students.title") }}</h2>
            <p class="my-2">{{ $t("pages.students.subtitle") }}</p>
          </div>
          <add-form-route
            :has="['students::add']"
            routeName="Students.create"
          />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <protected-view :has="['students::retrieve']">
          <students-list />
        </protected-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddFormRoute from "../../components/AddFormRoute.vue";
import StudentsList from "./StudentsList.vue";
export default {
  components: { AddFormRoute, StudentsList },
  async created() {
    this.$permissions().authorizeOneOf([
      "students::add",
      "students::remove",
      "students::retrieve",
      "students::update",
    ]);
    await this.loadStudents();
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
        "students::add",
        "students::remove",
        "students::retrieve",
        "students::update",
      ];
      this.$permissions().authorizeOneOf(permissions);
    },
    async loadStudents() {},
  },
};
</script>

<style></style>
