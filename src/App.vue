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
      await fetchData("/tils");
    }
  } catch (error) {
    console.error("ERROR: " + error.status); //JS error handling
  }
}

const host = "http://localhost:3000";
const tils = ref([]); // man gibt dem datentyp an welcher kommen wird, in unserem fall ist es eine Liste von Objekten
const subjects = ref([]);

const fetchData = async (path) => {
  const data = await handleRequest(host, path, "GET");
  if (path === "/tils" && data) {
    tils.value = data;
  } else if (path === "/subject" && data) {
    subjects.value = data;
  } else {
    console.log("Unknown path");
  }
}

onMounted(async () => {
  await fetchData("/tils");
  await fetchData("/subject");
});

const addData = async () => {
  if (document.getElementsByClassName("til")) {
    tils._rawValue.push(buildTilData("desc", "subject"));
    await handleRequest(host, "/tils", "POST", buildTilData("desc", "subject"))
    resetInputToEmpty("desc");
    resetInputToEmpty("subject")
  } else if (document.getElementsByClassName("subject")) {
    // todo 
  };
}

const updateData = async (til) => {
  if (document.getElementsByClassName("til")) {
    await handleRequest(host, "/tils" + "/" + til.id, "PUT",
      buildTilData(('editDesc' + til.id), ('editSubject' + til.id)));
  } else if (document.getElementsByClassName("subject")) {
    // todo 
  };

}

const deleteData = async (til) => {
  if (document.getElementsByClassName("til")) {
    await handleRequest(host, "/tils" + "/" + til.id, "DELETE")
  } else if (document.getElementsByClassName("subject")) {
    // todo 
  };
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
      <label for="editSubject" class="editSubject">Subject:
        <select id="subject">
          <option v-for="subject in subjects" :value="subject.desc" :key="subject.id">
            {{ subject.desc }}
          </option>
        </select>
      </label>
      <!-- <label for="addSubject" class="editSubject">Subject: <input id="subject" type="text"></label> -->
      <label for="addDesc" class="editTil">TIL: <input id="desc" type="text"></label>
      <button class="til" @click="addData()">Add</button>
      <button class="til" @click="enableEditing()">Edit</button>
      <button @click="showPopup = false">Close</button>
      <div class="show" :id="til.id" :key="til.id" v-for="til in getTilsforDate()">
          <label :for="'editSubject' + til.id" class="editSubject">Subject:
            <select v-model="til.subject" :id="'editSubject' + til.id" class="edit" disabled>
              <option v-for="subject in subjects" :value="subject.desc" :key="subject.id">
                {{ subject.desc }}
              </option>
            </select>
          </label>
          <label for="'editSueditDescbject' + til.id" class="editTil">TIL: <input :id="'editDesc' + til.id" type="text"
              class="edit" :value="til.desc" disabled></label>
        <button class="til" @click="updateData(til)">Update</button>
        <button class="til" @click="deleteData(til)">Delete</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  padding: 2rem;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.month {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #fdfdfd;
}

.month h3 {
  margin-bottom: 0.5rem;
}

.days {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.day {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.day:hover {
  background-color: #eaeaea;
}

.weekend_css {
    background-color: #ffeeba;
}

.event_css {
    font-style: italic;
    font-weight: bold;
}

.past_css {
    color: #999;
    background-color: #eee;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup {
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  max-height: 90vh;
  width: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.popup h3 {
  margin-bottom: 1rem;
  font-size: 1.4rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.popup label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
}

.popup select,
.popup input[type="text"] {
  width: 100%;
  padding: 8px 12px;
  font-size: 1rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.popup button {
  padding: 8px 14px;
  margin-right: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #0066cc;
  color: #fff;
  transition: background 0.3s;
}

.popup button:hover {
  background-color: #004999;
}

.popup button:last-of-type {
  background-color: #aaa;
}

.popup button:last-of-type:hover {
  background-color: #888;
}

.show {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  flex-wrap: wrap;
}

.show label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    gap: 5px;
    flex-shrink: 0;
}

/* Spezifisches Styling für das Subject-Label, damit es nicht wächst */
.show .editSubject {
    flex-grow: 0;
}

/* Spezifisches Styling für das TIL-Label, damit es wächst */
.show .editTil {
    flex-grow: 1; /* Lässt das Label den verfügbaren Platz einnehmen */
    flex-basis: 0; /* Optional: Hilft flex-grow, den Platz von einer Basisgröße Null zu verteilen */
}


.show select {
    width: auto;
    flex-grow: 0;
    margin-top: 0;
    min-width: 150px;
}

.show input[type="text"] {
    width: 100%; /* Füllt die Breite des Eltern-Labels aus */
    flex-grow: 0; /* Das Input-Feld selbst muss nicht mehr wachsen, da das Eltern-Label wächst */
    margin-top: 0;
    /* min-width könnte hier in Pixeln nützlich sein, um eine absolute Mindestgröße zu gewährleisten */
    /* z.B. min-width: 200px; */
}

.show button {
    flex-shrink: 0;
    margin-right: 0;
    margin-left: auto; /* Schiebt diesen Button und die folgenden nach rechts */
}

.show button + button {
    margin-left: 10px; /* Abstand zwischen den Buttons */
}

</style>