<script>
import HelloWorld from "./components/HelloWorld.vue";
import { getCurrentMonth, getAvailableDate } from "../utils/date";
export default {
  data() {
    return {
      dates: {},
      currentMonth: "",
    };
  },
  mounted() {
    this.currentMonth = getCurrentMonth();
    this.dates = getAvailableDate();
  },
  methods: {
    getDay(date) {
      return new Intl.DateTimeFormat("en", { day: "numeric" }).format(date);
    },
    handleSelectDay(day) {
      console.log({ day });
    },
  },
};
</script>

<template>
  <div class="min-h-screen py-4 px-6">
    <h1 class="text-center text-xl font-semibold">Personal Calendar Web App</h1>
    <h1 class="text-center text-xl font-semibold">{{ currentMonth }}</h1>
    <div class="w-full mt-4">
      <ul class="grid grid-cols-7 text-center font-semibold">
        <li>Monday</li>
        <li>Tuesday</li>
        <li>Wednesday</li>
        <li>Thursday</li>
        <li>Friday</li>
        <li>Saturday</li>
        <li>Sunday</li>
      </ul>
      <ul class="grid grid-cols-7 grid-rows-5 min-h-screen">
        <li
          v-for="(item, key) in 35"
          :key="key"
          class="relative cursor-pointer"
          :class="{
            'border border-gray-300 text-gray-300':
              dates[key]?.type !== 'current',
            'border border-gray-700': dates[key]?.type === 'current',
          }"
          @click="handleSelectDay(dates[key]?.date)"
        >
          <span class="absolute top-0 right-1">{{
            getDay(dates[key]?.date)
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
