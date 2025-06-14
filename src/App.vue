<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { ref, onMounted, computed } from "vue";

const from = dayjs("2024-09-05 08:00");
const to = dayjs("2025-07-07 08:00");
const today = dayjs();
const showPopup = ref(false);
const showPopupModify = ref(false);
const isEditing = ref(false);
const showPopupTil = ref(false);

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
  const containsAnySubject = (subjects, subjectsOnDay) => {
    return subjects.some(subject => subjectsOnDay.includes(subject));
  }
  while (current_day.isBefore(to, "day") || current_day.isSame(to, "day")) {
    const isEvent = data.some(event => is_event(current_day, event.date));
    const dateKey = current_day.format("YYYY-MM-DD");
    const subjectsForThisDay = tilsByDay.value[dateKey] || []; // leeres [] fuer tage ohne eintrag
    const hasSelectedSubject = containsAnySubject(selectedSubjects.value, subjectsForThisDay);
    const special_class = [
      is_today(current_day) ? "today_css" : "",
      past(current_day) ? "past_css" : "",
      weekend(current_day) ? "weekend_css" : "",
      isEvent ? "event_css" : "",
      hasSelectedSubject ? "selecetedSubject_css" : ""
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
const buildSubjectData = (subjectId) => ({
  "desc": getInputValue(subjectId)
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
      await fetchData("/subject")
    }
  } catch (error) {
    console.error("ERROR: " + error.status); //JS error handling
  }
}

const host = "http://localhost:3000";
const tils = ref([]); // man gibt dem datentyp an welcher kommen wird, in unserem fall ist es eine Liste von Objekten
const subjects = ref([]);
const selectedSbj = ref(null);

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

const addData = async (endPoint) => {
  if (endPoint === "/til") {
    tils._rawValue.push(buildTilData("desc", "subject"));
    await handleRequest(host, "/tils", "POST", buildTilData("desc", "subject"));
    resetInputToEmpty("desc");
    resetInputToEmpty("subject")
  } else if (endPoint === "/subject") {
    await handleRequest(host, "/subject", "POST", buildSubjectData("subjectName"));
    resetInputToEmpty("subjectName");
    console.log("subject");
  };
}

const updateData = async (api, endPoint) => {
  if (endPoint === "/til") {
    await handleRequest(host, "/tils" + "/" + api.id, "PUT",
      buildTilData(('editDesc' + api.id), ('editSubjectTil' + api.id)));
  } else if (endPoint === "/subject") {
    await handleRequest(host, "/subject" + "/" + api.id, "PUT",
      buildSubjectData("newSubjectName"));
  };
}

const deleteData = async (api, endPoint) => {
  if (endPoint === "/til") {
    await handleRequest(host, "/tils" + "/" + api.id, "DELETE")
  } else if (endPoint === "/subject") {
    await handleRequest(host, "/subject" + "/" + api.id, "DELETE")
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

const selectedSubjects = ref([]);

const showSubjectTil = (subject) => {
  if (selectedSubjects.value.includes(subject.desc)) {
    selectedSubjects.value = selectedSubjects.value.filter((word) => word !== subject.desc);
  } else {
    selectedSubjects.value.push(subject.desc)
  };
}

const tilsByDay = computed(() => {
  const dayTilsDict = {};
  tils.value.forEach(til => {
    const dateKey = til.date;
    if (!dayTilsDict[dateKey]) {
      dayTilsDict[dateKey] = [];
    }
    dayTilsDict[dateKey].push(til.subject);
  });
  return dayTilsDict;
});

function openPopupModify() {
  showPopupModify.value = true;
}

function openPopupTil() {
  showPopupTil.value = true;
}

</script>

<template>

  <div class="container">
    <div class="subjectsDiv">
      <h3>Subjects</h3>
      <div class="subjectDiv" v-for="subject in subjects" :key="subject.id" :id="subject.id"
        @click="showSubjectTil(subject)" :class="{ active: selectedSubjects.includes(subject.desc) }">
        {{ subject.desc }}
      </div>
      <button id="modifySbjData" class="subject" @click="openPopupModify()">Modify Data</button>
      <button id="modifySbjData" class="subject" @click="openPopupTil()">Show all Til</button>
    </div>

    <div class="month" v-for="month in months(from, to)" :key="month.format('YYYY-MM')">
      <h3>{{ month.format("MMM") }}</h3>
      <div class="days">
        <div class="day" :class="date.special_class, test" v-for="date in days(month, tils)"
          :key="date.current_day.format('YYYY-MM-DD')" @click="openPopup(date.current_day)">
          {{ date.current_day.format("ddd, DD") }}
        </div>
      </div>
    </div>
  </div>

  <div class="overlay" v-show="showPopup">
    <div class="popup">
      <h3>{{ popupTitle }}</h3>
      <label for="editSubjectTil" class="editSubjectTil">Subject:
        <select id="subject">
          <option v-for="subject in subjects" :value="subject.desc" :key="subject.id">
            {{ subject.desc }}
          </option>
        </select>
      </label>
      <label for="addDesc" class="editTil">TIL: <input id="desc" type="text"></label>
      <button class="til" @click="addData('/til')">Add</button>
      <button class="til" @click="enableEditing()">Edit</button>
      <button @click="showPopup = false">Close</button>
      <div class="show" :id="til.id" :key="til.id" v-for="til in getTilsforDate()">
        <label :for="'editSubjectTil' + til.id" class="editSubjectTil">Subject:
          <select v-model="til.subject" :id="'editSubjectTil' + til.id" class="edit" disabled>
            <option v-for="subject in subjects" :value="subject.desc" :key="subject.id">
              {{ subject.desc }}
            </option>
          </select>
        </label>
        <label for="'editSueditDescbject' + til.id" class="editTil">TIL: <input :id="'editDesc' + til.id" type="text"
            class="edit" :value="til.desc" disabled></label>
        <button class="til" @click="updateData(til, '/til')">Update</button>
        <button class="til" @click="deleteData(til, '/til')">Delete</button>
      </div>
    </div>
  </div>

  <div class="overlay" v-show="showPopupModify">
    <div class="popup">
      <h3>Modify Subject</h3>
      <label for="modifySubject" class="editSubject">Subject name to add: <input id="subjectName" type="text"></label>
      <button class="subject" @click="addData('/subject')">Add</button>
      <label for="editSubject" class="editSubject">Subject:
        <select id="subjectModify" v-model="selectedSbj">
          <option v-for="subject in subjects" :value="subject" :key="subject.id">
            {{ subject.desc }}
          </option>
        </select>
      </label>
      <div v-if="isEditing" class="editSubject">
        <label for="newSubjectName">New Subject Name:
          <input id="newSubjectName" v-model="newSubjectName" type="text">
        </label>
        <button class="subject" @click="updateData(selectedSbj, '/subject')">Save</button>
        <button class="subject" @click="isEditing = false">Cancel</button>
      </div>
      <button class="subject" @click="isEditing = true">Update</button>
      <button class="subject" @click="deleteData(selectedSbj, '/subject')">Delete</button>
      <button @click="showPopupModify = false">Close</button>
    </div>
  </div>

  <div class="overlay" v-show="showPopupTil">
    <div class="popup">
      <h3>Modify Subject</h3>
      <button class="close-btn" @click="showPopupTil = false">Close</button>
      <div v-for="til in tils" :key="til.id" class="til-item">
        <p><strong>Date:</strong> {{ dayjs(til.date).format('ddd, DD MMM YYYY') }}</p>
        <p><strong>Subject:</strong> {{ til.subject }}</p>
        <p><strong>Description:</strong> {{ til.desc }}</p>
        <hr />
      </div>
      <button @click="showPopupTil = false">Close</button>
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

.subjectsDiv {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #fdfdfd;
  flex-shrink: 0;
  width: 150px;
}

.subjectsDiv h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.subjectDiv {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  cursor: pointer;
  margin-bottom: 8px;
  width: 130px;
  transition: background 0.2s;
}

.active {
  font-weight: bold;
}

.subjectDiv:last-child {
  margin-bottom: 0;
}

.subjectDiv:hover {
  background-color: #eaeaea;
}

.months-container {
  flex-grow: 1;
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

.months-container.filter-active .day:not(.selecetedSubject_css) {
  opacity: 0.5;
  /* Reduziere die Deckkraft, um es auszugrauen */
  filter: grayscale(80%);
  /* Mache es gräulicher */
  color: #999;
  /* Ändere die Textfarbe zu grau */
  /* Optional: Entferne den Cursor, da es nicht mehr das "Hauptziel" ist */
  cursor: default;
  /* Optional: Stelle sicher, dass Hover-Effekte auf ausgegrauten Elementen reduziert sind */
  pointer-events: none;
  /* Kann Klicks auf diese Elemente verhindern, falls gewünscht */
}

/* Stil für die Tage, die das ausgewählte Subject haben */
/* Diese Klasse definiert die Hervorhebung selbst */
/* Stelle sicher, dass diese Stile nicht vom Ausgrau-Stil überschrieben werden (z.B. durch spezifischere Selektoren oder die Reihenfolge) */
.selecetedSubject_css {
  /* Deine gewünschten Hervorhebungs-Stile (z.B. Hintergrund, Rahmen, Schrift) */
  background-color: #ccccff;
  /* Beispiel: Heller Blauton */
  border-color: #0000cc;
  /* Beispiel: Dunklerer Rahmen */
  font-weight: bold;
  /* Beispiel: Schrift fett machen */
  /* Stelle sicher, dass sie sichtbar bleiben */
  opacity: 1 !important;
  /* Setze die Deckkraft explizit auf voll, um den obigen Stil zu überschreiben */
  filter: none !important;
  /* Entferne den Graustufen-Filter */
  color: inherit;
  /* Setze die Textfarbe zurück, falls oben geändert */
  cursor: pointer;
  /* Behalte den Cursor bei */
  pointer-events: auto;
  /* Erlaube Klicks */
  position: relative;
  /* Kann nützlich sein, um es über ausgegrauten Elementen zu positionieren */
  z-index: 1;
  /* Stelle sicher, dass es vorne liegt */
}

#modifySbjData {
  padding: 8px 14px;
  margin-bottom: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #0066cc;
  color: #fff;
  transition: background 0.3s;
  width: 100%;
  /* Optional, je nach Bedarf */
}

#modifySbjData:hover {
  background-color: #004999;
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
  position: relative;
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

.popup .close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  background-color: #aaa;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

.editSubject {
  margin-bottom: 1.5rem;
}


.show .editSubjectTil {
  flex-grow: 0;
}

.show .editTil {
  flex-grow: 1;
  flex-basis: 0;
}


.show select {
  width: auto;
  flex-grow: 0;
  margin-top: 0;
  min-width: 150px;
}

.show input[type="text"] {
  width: 100%;
  flex-grow: 0;
  margin-top: 0;
}

.show button {
  flex-shrink: 0;
  margin-right: 0;
  margin-left: auto;
}

.show button+button {
  margin-left: 10px;
}
</style>