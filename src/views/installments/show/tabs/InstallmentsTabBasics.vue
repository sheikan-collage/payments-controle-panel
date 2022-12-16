<template>
  <div>
    <h1>Basic and analytic data about the Installments</h1>
  </div>
</template>

<script>
export default {
  props: {
    installments: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
};
</script>

<style>
</style>