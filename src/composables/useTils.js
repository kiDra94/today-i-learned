// src/composables/useTils.js
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import * as api from "@/services/api";

export function useTils() {
  const tils = ref([]);
  const subjects = ref([]);
  const selectedSubjects = ref([]);
  const selectedSbj = ref(null);
  const currentDatePopup = ref(dayjs());

  // Computed: group tils by date
  const tilsByDay = computed(() => {
    const dict = {};
    tils.value.forEach((til) => {
      if (!dict[til.date]) dict[til.date] = [];
      dict[til.date].push(til.subject);
    });
    return dict;
  });

  // Load data on mount
  async function loadData() {
    try {
      tils.value = await api.getTils();
      subjects.value = await api.getSubjects();
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }

  onMounted(loadData);

  // Get TILs for a specific date
  function getTilsForDate(date = currentDatePopup.value) {
    const dateStr = date.format("YYYY-MM-DD");
    return tils.value.filter((til) => til.date === dateStr);
  }

  // Toggle subject filter
  function toggleSubjectFilter(subject) {
    const desc = subject.desc;
    const index = selectedSubjects.value.indexOf(desc);
    if (index > -1) {
      selectedSubjects.value.splice(index, 1);
    } else {
      selectedSubjects.value.push(desc);
    }
  }

  // TIL CRUD
  async function addTil(desc, subject) {
    const payload = {
      date: currentDatePopup.value.format("YYYY-MM-DD"),
      desc,
      subject,
    };
    await api.addTil(payload);
    await loadData();
  }

  async function updateTil(tilId, desc, subject) {
    const payload = {
      date: currentDatePopup.value.format("YYYY-MM-DD"),
      desc,
      subject,
    };
    await api.updateTil(tilId, payload);
    await loadData();
  }

  async function deleteTil(tilId) {
    await api.deleteTil(tilId);
    await loadData();
  }

  // Subject CRUD
  async function addSubject(desc) {
    await api.addSubject({ desc });
    await loadData();
  }

  async function updateSubject(subjectId, desc) {
    await api.updateSubject(subjectId, { desc });
    await loadData();
  }

  async function deleteSubject(subjectId) {
    await api.deleteSubject(subjectId);
    await loadData();
  }

  return {
    tils,
    subjects,
    selectedSubjects,
    selectedSbj,
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
  };
}
