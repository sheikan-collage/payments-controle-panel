const routes = [
  {
    path: "/reductions",
    name: "Reductions.index",
    component: () =>
      import(
        /* webpackChunkName: "reductions.index" */ "../views/reductions/Index.vue"
      ),
    children: [
      {
        path: "create",
        name: "Reductions.create",
        component: () =>
          import(
            /* webpackChunkName: "reductions.create" */ "../views/reductions/Create.vue"
          ),
      },
      {
        path: ":id",
        name: "Reductions.show",
        component: () =>
          import(
            /* webpackChunkName: "reductions.show" */ "../views/reductions/show/Index.vue"
          ),
      },
    ],
  },
];

export default routes;
