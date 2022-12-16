const routes = [
  {
    path: "/installments",
    name: "Installments.index",
    component: () =>
      import(/* webpackChunkName: "installments.index" */ "../views/installments/Index.vue"),
    children: [
      {
        path: "create",
        name: "Installments.create",
        component: () =>
          import(
            /* webpackChunkName: "installments.create" */ "../views/installments/Create.vue"
          ),
      },
      {
        path: ":id",
        name: "Installments.show",
        component: () =>
          import(
            /* webpackChunkName: "installments.show" */ "../views/installments/show/Index.vue"
          ),
      },
    ],
  },
];

export default routes;
