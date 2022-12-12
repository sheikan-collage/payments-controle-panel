
export const mainEventBus = new Vue({ store });

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import i18n from "./i18n";

Vue.config.productionTip = false;

import DatetimePicker from "vuetify-datetime-picker";
Vue.use(DatetimePicker);

import ProtectedView from "./components/ProtectedView.vue";
Vue.component("protected-view", ProtectedView);

import APIConfig from "./api/config";
import userConfig from "./config/index";
APIConfig.setDefaults();
userConfig.loadConfig();

Vue.prototype.$permissions = () => {
  return mainEventBus.$store.getters["Supervisors/permissions"];
};


const vm = new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
});

vm.$mount("#app");
