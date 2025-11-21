<script setup>
import dayjs from "dayjs";

defineProps({
  visible: { type: Boolean, required: true },
  tils: { type: Array, required: true },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <div v-show="visible" class="overlay">
    <div class="popup">
      <h3>All TILs</h3>
      <button class="close-btn" @click="emit('close')">Close</button>

      <div v-for="til in tils" :key="til.id" class="til-item">
        <p><strong>Date:</strong> {{ dayjs(til.date).format("ddd, DD MMM YYYY") }}</p>
        <p><strong>Subject:</strong> {{ til.subject }}</p>
        <p><strong>Description:</strong> {{ til.desc }}</p>
        <hr />
      </div>

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
  max-height: 90vh;
  width: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
}

.popup h3 {
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.close-btn {
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

.til-item {
  margin-bottom: 1rem;
}

.til-item p {
  margin: 0.25rem 0;
}

button {
  padding: 8px 14px;
  margin-right: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #0066cc;
  color: #fff;
  transition: background 0.3s;
}

button:hover {
  background-color: #004999;
}
</style>
