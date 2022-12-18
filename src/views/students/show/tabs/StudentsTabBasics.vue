<template>
  <div>
    <h1>Basic and analytic data about the student</h1>
  </div>
</template>

<script>
export default {
  props: {
    student: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
};
</script>

<style>
</style>