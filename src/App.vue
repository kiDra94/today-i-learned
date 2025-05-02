<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { ref, onMounted } from "vue";

const from = dayjs("2024-09-05 08:00");
const to = dayjs("2025-07-07 08:00");
const today = dayjs();
const showPopup = ref(false);

const is_today = (day) => day.isSame(today, "day");
const weekend = (day) => day.day() == 0 || day.day() == 6; // 0 SO, 6 SA
const past = (day) => day.isBefore(today, "day");
const is_event = (day, eventDay) => day.isSame(dayjs(eventDay));

const months = (from, to) => {
  const result = [];
  let current_month = from.startOf("month");
  while (current_month.isBefore(to, "month") || current_month.isSame(to, "month")) {
    result.push(current_month);
    current_month = current_month.add(1, "month");
  }
  return result;
}

const days = (month, data) => {
  const result = [];
  let current_day = month.startOf("month");
  const to = month.endOf("month");
  while (current_day.isBefore(to, "day") || current_day.isSame(to, "day")) {
    const isEvent = data.some(event => is_event(current_day, event.date));
    const special_class = [
      is_today(current_day) ? "today_css" : "",
      past(current_day) ? "past_css" : "",
      weekend(current_day) ? "weekend_css" : "",
      isEvent ? "event_css" : ""
    ].join(" ");
    result.push({ current_day, special_class });
    current_day = current_day.add(1, "day");
  }
  return result;
}

const tils = ref([]); // man gibt dem datentyp an welcher kommen wird, in unserem fall ist es eine Liste von Objekten
const fetcTils = async () => {
  try {
    const respons = await fetch("http://localhost:3000/tils");
    tils.value = await respons.json();
  } catch (error) {
  }
}

onMounted(async () => {
  await fetcTils();
});

const addTil = async () => {
  const tilsDate = currentDatePopup._rawValue.format('YYYY-MM-DD');
  const tilsDesc = document.getElementById("desc").value;
  tils._rawValue.push({ "date": tilsDate, "desc": tilsDesc });
  const respons = await fetch("http://localhost:3000/tils", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "date": tilsDate, "desc": tilsDesc })
  })
}

async function  updateTil(til) {
  const tilID = til.id;
  const tilsDesc = document.getElementById('editDesc' + til.id).value;
  const tilsSubject = document.getElementById('editSubject' + til.id).value;
  const respons = await fetch("http://localhost:3000/tils/" + tilID, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"id": tilID, "desc": tilsDesc, "subject": tilsSubject, "date": currentDatePopup.value.format("YYYY-MM-DD") })
  })
}

async function  deleteTil(til) {
  const tilID = til.id;
  const respons = await fetch("http://localhost:3000/tils/" + tilID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
}

const popupTitle = ref("");
const currentDatePopup = ref(dayjs());

function openPopup(date) {
  console.log(date.format("YYYY-MM-DD"));
  showPopup.value = true;
  const key = date;
  popupTitle.value = key.format('ddd, DD, MMM');
  currentDatePopup.value = date;
}

const getTilsforDate = () => {
  const matchingTils = [];
  tils.value.forEach(til => {
    if (til.date === currentDatePopup.value.format("YYYY-MM-DD")) {
      matchingTils.push(til);
    }
  });
  return matchingTils;
}

function enableEditing() {
  const inputs = document.querySelectorAll(".edit");
  inputs.forEach(input => {
    input.disabled = !input.disabled;
  })
}

</script>

<template>

  <div class="container">
    <div class="month" v-for="month in months(from, to)" :key="month.format('YYYY-MM')">
      <h3>{{ month.format("MMM") }}</h3>
      <div class="days">
        <div class="day" :class="date.special_class" v-for="date in days(month, tils)"
          :key="date.current_day.format('YYYY-MM-DD')" @click="openPopup(date.current_day)">
          {{ date.current_day.format("ddd, DD") }}
        </div>
      </div>
    </div>
  </div>

  <div class="overlay" v-show="showPopup">
    <div class="popup">
      <h3>{{ popupTitle }}</h3>
      <input id="desc" type="text">
      <button @click="addTil()">Add</button>
      <button @click="enableEditing()">Edit</button>
      <button @click="showPopup = false">Close</button>
      <div class="show" :id="til.id" :key="til" v-for="til in getTilsforDate()">
        <label :for="'editSubject' + til.id" class="editSubject">Subject: <input :id="'editSubject' + til.id" type="text" class="edit" :value="til.subject" disabled></label>
        <label for="'editSueditDescbject' + til.id" class="editTil">TIL: <input :id="'editDesc' + til.id" type="text" class="edit" :value="til.desc" disabled></label>
        <button @click="updateTil(til)">Update</button>
        <button @click="deleteTil(til)">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup {
  background-color: #f3f3f381;
  width: 500px; /* Adjusted to match the new .show width */
  padding: 20px;
  border-radius: 8px;
}

.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(199, 199, 199, 0.5);
}

.show {
  display: flex; /* Enable flexbox for side-by-side inputs */
  flex-direction: row;  /* Arrange inputs in a row */
  align-items: center;  /* Vertically center items */
  justify-content: space-between; /* Space between inputs */
  width: 100%;      /* Take full width of .popup */
  margin-top: 10px;
}

.show input {
  margin-bottom: 0;
  width: 48%;
  box-sizing: border-box;
}

.edit {
  font-weight: bold;
  flex-grow: 1;
}

#desc {
  width: 100%; /* Make the #desc input take full width */
  margin-bottom: 10px; /* Add space below #desc */
}

.popup button {
  margin-right: 10px; /* Add horizontal space between buttons */
}

.container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.month {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  overflow: hidden;
}

h3 {
  margin: 10px 0;
  font-size: 1.2rem;
}

.days {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  align-content: flex-start;
  padding: 5px;
  overflow-y: auto;
}

.day {
  width: 100%;
  display: flex;
  background-color: #f3f3f3;
  border: 1px solid #ddd;
  font-size: 0.9rem;
}

.event_css {
  font-weight: bold;
  font-style: italic;
  color: rgb(187, 14, 147);
}

.today_css {
  background-color: red;
}

.past_css {
  background-color: blue;
  opacity: 0.6;
}

.weekend_css {
  background-color: green;
}

.weekend_css .past_css {
  background-color: beige;
}
</style>