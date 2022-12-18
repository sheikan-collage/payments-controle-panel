const routes = [
  {
    path: "/students",
    name: "Students.index",
    component: () =>
      import(/* webpackChunkName: "students.index" */ "../views/students/Index.vue"),
    children: [
      {
        path: "create",
        name: "Students.create",
        component: () =>
          import(
            /* webpackChunkName: "students.create" */ "../views/students/Create.vue"
          ),
      },
      {
        path: ":id",
        name: "Students.show",
        component: () =>
          import(
            /* webpackChunkName: "students.show" */ "../views/students/show/Index.vue"
          ),
      },
    ],
  },
];

export default routes;
