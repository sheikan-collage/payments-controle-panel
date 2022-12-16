const routes = [
  {
    path: "/fees",
    name: "Fees.index",
    component: () =>
      import(/* webpackChunkName: "fees.index" */ "../views/fees/Index.vue"),
    children: [
      {
        path: "create",
        name: "Fees.create",
        component: () =>
          import(
            /* webpackChunkName: "fees.create" */ "../views/fees/Create.vue"
          ),
      },
      {
        path: ":id",
        name: "Fees.show",
        component: () =>
          import(
            /* webpackChunkName: "fees.show" */ "../views/fees/show/Index.vue"
          ),
      },
    ],
  },
];

export default routes;
