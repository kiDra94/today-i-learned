<script setup>
import { ref } from "vue";

const props = defineProps({
  visible: { type: Boolean, required: true },
  subjects: { type: Array, required: true },
});

const emit = defineEmits([
  "close",
  "add-subject",
  "update-subject",
  "delete-subject",
]);

const newSubjectName = ref("");
const selectedSubject = ref(null);
const isEditing = ref(false);
const editName = ref("");

function handleAdd() {
  if (!newSubjectName.value) return;
  emit("add-subject", newSubjectName.value);
  newSubjectName.value = "";
}

function handleUpdate() {
  if (!selectedSubject.value || !editName.value) return;
  emit("update-subject", selectedSubject.value.id, editName.value);
  isEditing.value = false;
  editName.value = "";
}

function handleDelete() {
  if (!selectedSubject.value) return;
  emit("delete-subject", selectedSubject.value.id);
  selectedSubject.value = null;
}
</script>

<template>
  <div v-show="visible" class="overlay">
    <div class="popup">
      <h3>Modify Subject</h3>

      <label class="editSubject">
        Subject name to add:
        <input v-model="newSubjectName" type="text" />
      </label>
      <button class="subject" @click="handleAdd">Add</button>

      <label class="editSubject">
        Subject:
        <select v-model="selectedSubject">
          <option v-for="subject in subjects" :key="subject.id" :value="subject">
            {{ subject.desc }}
          </option>
        </select>
      </label>

      <div v-if="isEditing" class="editSubject">
        <label>
          New Subject Name:
          <input v-model="editName" type="text" />
        </label>
        <button class="subject" @click="handleUpdate">Save</button>
        <button class="subject" @click="isEditing = false">Cancel</button>
      </div>

      <button class="subject" @click="isEditing = true; editName = selectedSubject?.desc || ''">
        Update
      </button>
      <button class="subject" @click="handleDelete">Delete</button>
      <button @click="emit('close')">Close</button>
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
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.popup h3 {
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.editSubject {
  display: block;
  margin-bottom: 1.5rem;
}

.editSubject label {
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

.subject {
  padding: 8px 14px;
  margin-right: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #0066cc;
  color: #fff;
  transition: background 0.3s;
}

.subject:hover {
  background-color: #004999;
}

button:last-of-type {
  background-color: #aaa;
}

button:last-of-type:hover {
  background-color: #888;
}
</style>
