<script setup>
import dayjs from "dayjs";
import "dayjs/locale/de";
import { ref, computed } from "vue";

import SubjectsSidebar from "@/components/SubjectsSidebar.vue";
import CalendarMonth from "@/components/CalendarMonth.vue";
import DayPopup from "@/components/DayPopup.vue";
import SubjectModal from "@/components/SubjectModal.vue";
import AllTilsModal from "@/components/AllTilsModal.vue";

import { useTils } from "@/composables/useTils";
import { useCalendar } from "@/composables/useCalendar";

const from = dayjs("2024-09-05 08:00");
const to = dayjs("2025-07-07 08:00");

// Data and logic from composables
const {
  tils,
  subjects,
  selectedSubjects,
  currentDatePopup,
  tilsByDay,
  getTilsForDate,
  toggleSubjectFilter,
  addTil,
  updateTil,
  deleteTil,
  addSubject,
  updateSubject,
  deleteSubject,
} = useTils();

const { months, getDaysForMonth } = useCalendar(from, to, tilsByDay, selectedSubjects);

// Modal visibility
const showDayPopup = ref(false);
const showSubjectModal = ref(false);
const showAllTilsModal = ref(false);

// Computed popup title
const popupTitle = computed(() => currentDatePopup.value.format("ddd, DD, MMM"));

// Handlers
function openDayPopup(date) {
  currentDatePopup.value = date;
  showDayPopup.value = true;
}

async function handleAddTil(payload) {
  await addTil(payload.desc, payload.subject);
}

async function handleUpdateTil(til) {
  await updateTil(til.id, til.desc, til.subject);
}

async function handleDeleteTil(til) {
  await deleteTil(til.id);
}

async function handleAddSubject(name) {
  await addSubject(name);
}

async function handleUpdateSubject(id, name) {
  await updateSubject(id, name);
}

async function handleDeleteSubject(id) {
  await deleteSubject(id);
}
</script>

<template>
  <div class="container">
    <SubjectsSidebar
      :subjects="subjects"
      :selected-subjects="selectedSubjects"
      @toggle-subject="toggleSubjectFilter"
      @open-modify="showSubjectModal = true"
      @open-all-tils="showAllTilsModal = true"
    />

    <div
      class="calendar-wrapper"
      :class="{ 'filter-active': selectedSubjects.length }"
    >
      <CalendarMonth
        v-for="month in months"
        :key="month.format('YYYY-MM')"
        :month="month"
        :days="getDaysForMonth(month, tils)"
        @select-day="openDayPopup"
      />
    </div>
  </div>

  <DayPopup
    :visible="showDayPopup"
    :title="popupTitle"
    :subjects="subjects"
    :tils-for-date="getTilsForDate()"
    @close="showDayPopup = false"
    @add-til="handleAddTil"
    @update-til="handleUpdateTil"
    @delete-til="handleDeleteTil"
  />

  <SubjectModal
    :visible="showSubjectModal"
    :subjects="subjects"
    @close="showSubjectModal = false"
    @add-subject="handleAddSubject"
    @update-subject="handleUpdateSubject"
    @delete-subject="handleDeleteSubject"
  />

  <AllTilsModal
    :visible="showAllTilsModal"
    :tils="tils"
    @close="showAllTilsModal = false"
  />
</template>

<style scoped>
.container {
  padding: 2rem;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.calendar-wrapper {
  flex-grow: 1;
  display: grid;              
  grid-template-columns: repeat(12, 1fr);            
  gap: 1rem;                  
}

.filter-active :deep(.day:not(.selecetedSubject_css)) {
  opacity: 0.5;
  filter: grayscale(80%);
  color: #999;
  cursor: default;
  pointer-events: none;
}
</style>
