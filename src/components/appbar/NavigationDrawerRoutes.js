export default [
  {
    titleKey: "Fees",
    icon: "mdi-currency-usd",
    name: "Fees.index",
    hasOneOf: ["fees::add", "fees::remove", "fees::retrieve", "fees::update"],
  },
  {
    titleKey: "Installments",
    icon: "mdi-format-list-checks",
    name: "Installments.index",
    hasOneOf: [
      "installments::add",
      "installments::retrieve",
      "installments::update",
      "installments::remove",
    ],
  },
  {
    titleKey: "Reductions",
    icon: "mdi-ticket-percent-outline",
    name: "Reductions.index",
    hasOneOf: [
      "reductions::add",
      "reductions::retrieve",
      "reductions::update",
      "reductions::remove",
    ],
  },
  {
    titleKey: "Students",
    icon: "mdi-school",
    name: "Students.index",
    hasOneOf: [
      "students::add",
      "students::retrieve",
      "students::update",
      "students::remove",
    ],
  },
  {
    titleKey: "Supervisors",
    icon: "mdi-account-tie-outline",
    name: "Supervisors.index",
    hasOneOf: [
      "supervisors::add",
      "supervisors::remove",
      "supervisors::retrieve",
      "supervisors::update",
      "supervisors::view_role",
      "supervisors::set_role",
      "supervisors::revoke_role",
      "supervisors::view_permissions",
    ],
  },
  {
    titleKey: "Roles",
    icon: "mdi-tag-text-outline",
    name: "Roles.index",
    hasOneOf: [
      "roles::add",
      "roles::remove",
      "roles::retrieve",
      "roles::update",
      "roles::view_permissions",
      "roles::set_permissions",
    ],
  },
];
