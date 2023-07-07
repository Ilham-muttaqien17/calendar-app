<template>
  <div
    class="flex flex-col bg-color text-white text-sm max-w-[150px] p-2 overflow-hidden rounded-md"
    :style="customStyle"
  >
    <span>{{ item.name }}</span>
    <span>{{ item.time }}</span>
    <span>invited: {{ item.invitees_by_email }}</span>
  </div>
</template>

<script>
export default {
  name: "EventCard",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    customStyle() {
      return {
        "--bg-color": this.item.color,
      };
    },
  },
};
</script>

<style scoped>
.bg-color {
  background-color: var(--bg-color);
}
</style>