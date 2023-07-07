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
      confirmDeleteVisibility: false,
      updateModalVisibility: false,
      selectedDate: "",
      selectedEventId: "",
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
      this.selectedDate = day;
      this.modalEventVisibility = true;
      const event = this.events.filter((e) => e.date === this.formatDate(day));
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
    handleDeleteModal(item) {
      this.modalEventVisibility = false;
      this.confirmDeleteVisibility = true;
      this.selectedEventId = item.id;
    },
    handleUpdateModal(item) {
      this.form = {
        name: item.name,
        time: item.time,
        invitees_by_email: item.invitees_by_email,
      };
      this.modalEventVisibility = false;
      this.updateModalVisibility = true;
      this.selectedEventId = item.id;
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
    async handleDeleteEvent() {
      let response = await api.delete(`/events/${this.selectedEventId}`);

      if (response.status === 200) {
        window.location.reload();
      }
    },
    async handleUpdateEvent() {
      const data = {
        name: this.form.name,
        time: this.form.time,
        invitees_by_email: this.form.invitees_by_email,
      };

      const response = await api.patch(`/events/${this.selectedEventId}`, data);
      if (response.status === 200) {
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
      <h2 class="text-lg font-semibold mb-4">
        List Event on {{ formatDate(selectedDate) }}
      </h2>
      <div v-for="(item, key) in events" :key="key">
        <div
          class="flex items-center space-x-4"
          v-if="item.date === formatDate(selectedDate)"
        >
          <event-card :item="item" :maxWidth="300" />
          <div class="flex items-center space-x-2 ml-auto">
            <button
              @click="handleUpdateModal(item)"
              class="bg-yellow-400 text-white px-2 py-1 rounded-md"
            >
              Update
            </button>
            <button
              @click="handleDeleteModal(item)"
              class="bg-red-500 text-white px-2 py-1 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
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
          <label for="time">Time</label>
          <input
            class="outline-none border border-gray-300 rounded-lg px-2 py-1"
            v-model="form.time"
            type="time"
            id="time"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="invitees_by_email">Invitees Email</label>
          <input
            class="outline-none border border-gray-300 rounded-lg px-2 py-1"
            v-model="form.invitees_by_email"
            type="text"
            id="invitees_by_email"
          />
        </div>
        <button class="text-white bg-blue-500 px-4 py-2 rounded-lg mt-4">
          Submit
        </button>
      </form>
    </modal-base>

    <!-- Modal Delete Event Confirmation -->
    <modal-base
      v-if="confirmDeleteVisibility"
      :width="500"
      @close-modal="confirmDeleteVisibility = false"
    >
      <div class="flex flex-col">
        <span class="text-lg font-semibold"
          >Are you sure want to delete this event?</span
        >
        <div class="flex items-center space-x-4 mt-6 ml-auto">
          <button
            class="bg-gray-400 text-white px-2 py-1 rounded-md"
            @click="confirmDeleteVisibility = false"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteEvent"
            class="bg-red-500 text-white px-2 py-1 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </modal-base>

    <!-- Modal Update Event -->
    <modal-base
      v-if="updateModalVisibility"
      :width="500"
      @close-modal="
        updateModalVisibility = false;
        form = {};
      "
    >
      <form class="flex flex-col space-y-2" @submit.prevent="handleUpdateEvent">
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
          <label for="time">Time</label>
          <input
            class="outline-none border border-gray-300 rounded-lg px-2 py-1"
            v-model="form.time"
            type="time"
            id="time"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="invitees_by_email">Invitees Email</label>
          <input
            class="outline-none border border-gray-300 rounded-lg px-2 py-1"
            v-model="form.invitees_by_email"
            type="text"
            id="invitees_by_email"
          />
        </div>
        <button class="text-white bg-blue-500 px-4 py-2 rounded-lg mt-4">
          Update
        </button>
      </form>
    </modal-base>
  </div>
</template>
