<template>
  <div>
    <h1>Basic and analytic data about the fee</h1>
  </div>
</template>

<script>
export default {
  props: {
    fees: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
};
</script>

<style>
</style>