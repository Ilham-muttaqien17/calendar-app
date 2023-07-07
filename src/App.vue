<script>
import { getCurrentMonth, getAvailableDate } from "../utils/date";
import ModalBase from "./components/ModalBase.vue";
import { api } from "../utils/api";
import EventCard from "./components/EventCard.vue";
import { getRandomColor } from "../utils/color";
export default {
  components: { ModalBase, EventCard },
  data() {
    return {
      dates: [],
      events: [],
      form: {
        name: "",
        time: "",
        invitees_by_email: "",
      },
      currentMonth: "",
      modalEventVisibility: false,
      modalPostEventVisibility: false,
      selectedDate: "",
      disabled: false,
    };
  },
  async mounted() {
    this.currentMonth = getCurrentMonth();
    this.dates = getAvailableDate();
    let response = await api.get("/events");
    this.events = response.data;
  },
  methods: {
    getDay(date) {
      return new Intl.DateTimeFormat("en", { day: "numeric" }).format(date);
    },
    handleSelectDay(day) {
      console.log({ day });
      this.selectedDate = day;
      this.modalEventVisibility = true;
      const event = this.events.filter((e) => e.date === this.formatDate(day));
      console.log({ event });
      this.disabled = event.length > 3 ? true : false;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${new Intl.DateTimeFormat("en", {
        month: "2-digit",
      }).format(date)}-${new Intl.DateTimeFormat("en", {
        day: "2-digit",
      }).format(date)}`;
    },
    handleClickCreate() {
      this.modalEventVisibility = false;
      this.modalPostEventVisibility = true;
    },
    async handleCreateEvent() {
      const selectedColor = [];
      this.events.map((e) => {
        if (e.date === this.formatDate(this.selectedDate)) {
          selectedColor.push(e.color);
        }
      });

      const data = {
        name: this.form.name,
        time: this.form.time,
        invitees_by_email: this.form.invitees_by_email,
        date: this.formatDate(this.selectedDate),
        color: getRandomColor(selectedColor),
      };
      const response = await api.post("/events", data);
      if (response.status === 201) {
        window.location.reload();
      }
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
          v-for="(item, key1) in 35"
          :key="key1"
          class="relative cursor-pointer"
          :class="{
            'border border-gray-300 text-gray-300':
              dates[key1]?.type !== 'current',
            'border border-gray-700': dates[key1]?.type === 'current',
          }"
          @click="handleSelectDay(dates[key1]?.date)"
        >
          <span class="absolute top-0 right-1">{{
            getDay(dates[key1]?.date)
          }}</span>
          <div v-for="(item, key2) in events" :key="key2">
            <span v-if="item.date === formatDate(dates[key1]?.date)">
              <event-card :item="item" />
            </span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Modal List Event -->
    <modal-base
      :width="500"
      v-if="modalEventVisibility"
      @close-modal="modalEventVisibility = false"
    >
      <h2 class="text-lg font-semibold">
        List Event on {{ formatDate(selectedDate) }}
      </h2>
      <div v-for="(item, key) in events" :key="key">
        <span v-if="item.date === formatDate(selectedDate)">
          <event-card :item="item" />
        </span>
      </div>
      <button
        @click="handleClickCreate"
        :disabled="disabled"
        class="text-white px-4 py-2 rounded-lg mt-4"
        :class="{ 'bg-gray-300': disabled, 'bg-blue-500': !disabled }"
      >
        Create Event
      </button>
    </modal-base>

    <!-- Modal Post Event -->
    <modal-base
      :width="500"
      v-if="modalPostEventVisibility"
      @close-modal="modalPostEventVisibility = false"
    >
      <form class="flex flex-col space-y-2" @submit.prevent="handleCreateEvent">
        <div class="flex flex-col space-y-1">
          <label for="name">Event Name</label>
          <input
            class="outline-none border border-gray-300 rounded-lg px-2 py-1"
            v-model="form.name"
            type="text"
            id="name"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="name">Time</label>
          <input
            class="outline-none border border-gray-300 rounded-lg px-2 py-1"
            v-model="form.time"
            type="time"
            id="name"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="name">Invitees Email</label>
          <input
            class="outline-none border border-gray-300 rounded-lg px-2 py-1"
            v-model="form.invitees_by_email"
            type="text"
            id="name"
          />
        </div>
        <button class="text-white bg-blue-500 px-4 py-2 rounded-lg mt-4">
          Submit
        </button>
      </form>
    </modal-base>
  </div>
</template>
