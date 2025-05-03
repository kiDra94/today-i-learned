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

const getInputValue = (id) => document.getElementById(id).value || "";
const resetInputToEmpty = (id) => document.getElementById(id).value = "";
const buildTilData = (descInputId, subjectInputID) => ({
  "date": currentDatePopup._rawValue.format("YYYY-MM-DD"),
  "desc": getInputValue(descInputId),
  "subject": getInputValue(subjectInputID)
});
const errorHandling = (respons) => {
  if (!respons.ok) {
    console.log("ERROR: " + respons.status);
    alert("Something went wront ERROR: " + respons.status);
  }
}
const buildHeader = (method, data) => (
  {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  }
)

const handleRequest = async (url, path, method, data) => {
  try {
    const respons = await fetch(url + path, buildHeader(method, data));
    errorHandling(respons);
    if (method === "GET") {
      return await respons.json();
    } else {
      await fetcTils();
    }
  } catch (error) {
    console.error("ERROR: " + error.status); //JS error handling
  }
}

const host = "http://localhost:3000";

const fetcTils = async () => {
  const data = await handleRequest(host, "/tils", "GET");
  if (data) {
    tils.value = data;
  };
}

onMounted(async () => {
  await fetcTils();
});

const addTil = async () => {
  tils._rawValue.push(buildTilData("desc", "subject"));
  await handleRequest(host, "/tils", "POST", buildTilData("desc", "subject"))
  resetInputToEmpty("desc");
  resetInputToEmpty("subject");
}

const updateTil = async (til) => {
  await handleRequest(host, "/tils" + "/" + til.id, "PUT",
    buildTilData(('editDesc' + til.id), ('editSubject' + til.id)));
}

const deleteTil = async (til) => {
  await handleRequest(host, "/tils" + "/" + til.id, "DELETE")
}

const popupTitle = ref("");
const currentDatePopup = ref(dayjs());

function openPopup(date) {
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
      <label for="addSubject" class="editSubject">Subject: <input id="subject" type="text"></label>
      <label for="addDesc" class="editTil">TIL: <input id="desc" type="text"></label>
      <button @click="addTil()">Add</button>
      <button @click="enableEditing()">Edit</button>
      <button @click="showPopup = false">Close</button>
      <div class="show" :id="til.id" :key="til" v-for="til in getTilsforDate()">
        <label :for="'editSubject' + til.id" class="editSubject">Subject: <input :id="'editSubject' + til.id"
            type="text" class="edit" :value="til.subject" disabled></label>
        <label for="'editSueditDescbject' + til.id" class="editTil">TIL: <input :id="'editDesc' + til.id" type="text"
            class="edit" :value="til.desc" disabled></label>
        <button @click="updateTil(til)">Update</button>
        <button @click="deleteTil(til)">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* General body styling for better base */
body {
  font-family: 'Inter', sans-serif;
  /* Using Inter font */
  margin: 0;
  padding: 0;
  background-color: #f4f7f6;
  /* Light background */
  color: #333;
}

/* Container for the main layout */
.container {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  /* Use min-height for better handling of content */
  overflow: hidden;
  /* Prevent overflow issues */
}

/* Styling for the month view */
.month {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 15px;
  /* Add some padding */
  background-color: #fff;
  /* White background for the month area */
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* Subtle shadow */
  margin: 10px;
  /* Add margin around the month */
}

h3 {
  margin: 0 0 15px 0;
  /* Adjust margin */
  font-size: 1.5rem;
  /* Slightly larger font size */
  color: #007bff;
  /* Highlight color */
}

/* Styling for the days container */
.days {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  align-content: flex-start;
  padding: 0;
  /* Remove padding here, add to day */
  overflow-y: auto;
  gap: 5px;
  /* Add gap between day elements */
}

/* Styling for individual day elements */
.day {
  width: 100%;
  /* Keep width 100% for list-like structure */
  display: flex;
  flex-direction: column;
  /* Stack content vertically */
  background-color: #e9ecef;
  /* Light grey background for days */
  border: 1px solid #ced4da;
  /* Subtle border */
  border-radius: 5px;
  /* Rounded corners for days */
  padding: 10px;
  /* Add padding inside day */
  font-size: 1rem;
  text-align: left;
  /* Align text to the left */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  /* Very subtle shadow */
}

/* Styling for events within a day */
.event_css {
  font-weight: bold;
  font-style: italic;
  color: #dc3545;
  /* Reddish color for events */
  margin-top: 5px;
  /* Space above event */
}

/* Styling for the current day */
.today_css {
  background-color: #ffc107;
  /* Yellowish color for today */
  border-color: #ffb300;
}

/* Styling for past days */
.past_css {
  background-color: #6c757d;
  /* Grey color for past days */
  color: #f8f9fa;
  /* Light text for past days */
  opacity: 0.9;
  /* Slightly less opaque */
}

/* Specific styling for weekend days */
.weekend_css {
  background-color: #28a745;
  /* Greenish color for weekends */
  color: #fff;
  /* White text for weekends */
}

/* Specific styling for past weekend days */
.weekend_css.past_css {
  background-color: #adb5bd;
  /* Different grey for past weekends */
  color: #495057;
}

.event_css.past_css {
  color: #dc3546;
}

/* --- Overlay and Popup Styling --- */

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
  background-color: rgba(0, 0, 0, 0.5);
  /* Darker, more prominent overlay */
  backdrop-filter: blur(5px);
  /* Add a blur effect */
}

.popup {
  background-color: #ffffff;
  /* White background for popup */
  width: 90%;
  /* Make popup responsive */
  max-width: 700px;
  /* Max width for larger screens */
  padding: 30px;
  /* More padding */
  border-radius: 12px;
  /* More rounded corners */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  /* Stronger shadow */
  text-align: center;
  /* Center content inside popup */
}

.popup h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #343a40;
  /* Darker color for popup title */
}

/* Styling for labels and inputs in the add section */
.popup label {
  display: block;
  /* Make labels block elements */
  margin-bottom: 15px;
  /* Space between labels/inputs */
  text-align: left;
  /* Align label text to the left */
  font-weight: bold;
  color: #555;
}

.popup input[type="text"] {
  width: 100%;
  /* Full width inputs */
  padding: 10px;
  margin-top: 5px;
  /* Space between label and input */
  border: 1px solid #ced4da;
  border-radius: 5px;
  box-sizing: border-box;
  /* Include padding and border in element's total width and height */
  font-size: 1rem;
}

/* Specific styling for the TIL description input */
#desc {
  min-height: 80px;
  /* Give more height for TIL description */
  resize: vertical;
  /* Allow vertical resizing */
}

/* Styling for buttons */
.popup button {
  padding: 10px 20px;
  margin: 10px 5px;
  /* Adjust margin */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.1s ease;
  /* Smooth transition */
}

.popup button:hover {
  transform: translateY(-1px);
  /* Slight lift on hover */
}

/* Specific button styles */
.popup button:nth-of-type(1) {
  /* Add button */
  background-color: #28a745;
  /* Green */
  color: white;
}

.popup button:nth-of-type(1):hover {
  background-color: #218838;
}

.popup button:nth-of-type(2) {
  /* Edit button */
  background-color: #ffc107;
  /* Yellow */
  color: #212529;
}

.popup button:nth-of-type(2):hover {
  background-color: #e0a800;
}

.popup button:nth-of-type(3) {
  /* Close button */
  background-color: #dc3545;
  /* Red */
  color: white;
}

.popup button:nth-of-type(3):hover {
  background-color: #c82333;
}


/* Styling for the displayed TIL items */
.show {
  display: flex;
  flex-direction: column;
  /* Stack items vertically on small screens */
  align-items: flex-start;
  /* Align items to the start */
  background-color: #f8f9fa;
  /* Light background for displayed items */
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  /* Space above each displayed item */
  text-align: left;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
}

.show label {
  display: block;
  /* Labels are block */
  margin-bottom: 10px;
  font-weight: normal;
  /* Normal weight for displayed labels */
  color: #333;
}

.show input.edit {
  width: 100%;
  /* Full width inputs in show */
  padding: 8px;
  margin-top: 3px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 0.95rem;
  background-color: #e9ecef;
  /* Different background for disabled inputs */
  cursor: not-allowed;
  /* Indicate disabled */
}

.show input.edit:disabled {
  opacity: 0.8;
}

.show button {
  margin-top: 10px;
  /* Space above buttons in show */
  margin-right: 10px;
  padding: 8px 15px;
  font-size: 0.9rem;
}

.show button:nth-of-type(1) {
  /* Update button */
  background-color: #17a2b8;
  /* Cyan */
  color: white;
}

.show button:nth-of-type(1):hover {
  background-color: #138496;
}

.show button:nth-of-type(2) {
  /* Delete button */
  background-color: #dc3545;
  /* Red */
  color: white;
}

.show button:nth-of-type(2):hover {
  background-color: #c82333;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .show {
    flex-direction: row;
    /* Row direction on larger screens */
    align-items: center;
    justify-content: space-between;
  }

  .show label {
    flex-basis: 48%;
    /* Give labels a basis */
    margin-bottom: 0;
    /* Remove bottom margin */
  }

  .show input.edit {
    width: auto;
    /* Auto width */
    flex-grow: 1;
    /* Allow input to grow */
    margin-right: 10px;
    /* Space between input and buttons */
  }

  .show button {
    margin-top: 0;
    /* Remove top margin */
  }
}
</style>