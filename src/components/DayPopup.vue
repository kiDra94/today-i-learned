<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, required: true },
  subjects: { type: Array, required: true },
  tilsForDate: { type: Array, required: true },
});

const emit = defineEmits(["close", "add-til", "update-til", "delete-til"]);

const newDesc = ref("");
const newSubject = ref("");
const editableTils = ref([]);

watch(
  () => props.tilsForDate,
  (tils) => {
    editableTils.value = tils.map((t) => ({
      ...t,
      disabled: true,
    }));
  },
  { immediate: true }
);

function handleAdd() {
  if (!newDesc.value || !newSubject.value) return;
  emit("add-til", { desc: newDesc.value, subject: newSubject.value });
  newDesc.value = "";
  newSubject.value = "";
}

function toggleEdit() {
  editableTils.value.forEach((til) => {
    til.disabled = !til.disabled;
  });
}

function handleUpdate(til) {
  emit("update-til", til);
}

function handleDelete(til) {
  emit("delete-til", til);
}
</script>

<template>
  <div v-show="visible" class="overlay">
    <div class="popup">
      <h3>{{ title }}</h3>

      <label class="editSubjectTil">
        Subject:
        <select v-model="newSubject">
          <option v-for="subject in subjects" :key="subject.id" :value="subject.desc">
            {{ subject.desc }}
          </option>
        </select>
      </label>

      <label class="editTil">
        TIL:
        <input v-model="newDesc" type="text" />
      </label>

      <button class="til" @click="handleAdd">Add</button>
      <button class="til" @click="toggleEdit">Edit</button>
      <button @click="emit('close')">Close</button>

      <div v-for="til in editableTils" :key="til.id" class="show">
        <label class="editSubjectTil">
          Subject:
          <select v-model="til.subject" class="edit" :disabled="til.disabled">
            <option v-for="subject in subjects" :key="subject.id" :value="subject.desc">
              {{ subject.desc }}
            </option>
          </select>
        </label>

        <label class="editTil">
          TIL:
          <input v-model="til.desc" type="text" class="edit" :disabled="til.disabled" />
        </label>

        <button class="til" @click="handleUpdate(til)">Update</button>
        <button class="til" @click="handleDelete(til)">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.show .editTil {
  flex-grow: 1;
}

.show select {
  width: auto;
  min-width: 150px;
}

.show button {
  flex-shrink: 0;
  margin-left: auto;
}
</style>
