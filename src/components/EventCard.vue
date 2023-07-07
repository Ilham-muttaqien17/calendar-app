<template>
  <div
    class="flex flex-col bg-color cmax-width text-white text-sm w-full p-2 overflow-hidden rounded-md"
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
    maxWidth: {
      type: Number,
      default: 150,
    },
  },
  computed: {
    customStyle() {
      return {
        "--bg-color": this.item.color,
        "--max-width": this.maxWidth + "px",
      };
    },
  },
};
</script>

<style scoped>
.bg-color {
  background-color: var(--bg-color);
}
.cmax-width {
  max-width: var(--max-width);
}
</style>