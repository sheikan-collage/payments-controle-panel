const routes = [
  {
    path: "/payments",
    name: "Payments.index",
    component: () =>
      import(
        /* webpackChunkName: "fees.index" */ "../views/payments/Index.vue"
      ),
  },
];

export default routes;
