<script setup>
defineProps({
  subjects: { type: Array, required: true },
  selectedSubjects: { type: Array, required: true },
});

const emit = defineEmits([
  "toggle-subject",
  "open-modify",
  "open-all-tils",
]);
</script>

<template>
  <div class="subjectsDiv">
    <h3>Subjects</h3>
    <div
      v-for="subject in subjects"
      :key="subject.id"
      class="subjectDiv"
      :class="{ active: selectedSubjects.includes(subject.desc) }"
      @click="emit('toggle-subject', subject)"
    >
      {{ subject.desc }}
    </div>
    <button class="subject" @click="emit('open-modify')">
      Modify Data
    </button>
    <button class="subject" @click="emit('open-all-tils')">
      Show all TIL
    </button>
  </div>
</template>

<style scoped>
.subjectsDiv {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #fdfdfd;
  flex-shrink: 0;
  width: 150px;
  position: sticky;         
  top: 2rem;                  
  align-self: flex-start;     
  max-height: calc(100vh - 4rem);  
  overflow-y: auto;           
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
  transition: background 0.2s;
}

.subjectDiv:hover {
  background-color: #eaeaea;
}

.active {
  font-weight: bold;
  background-color: #e0e0ff;
}

.subject {
  padding: 8px 14px;
  margin-bottom: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #0066cc;
  color: #fff;
  transition: background 0.3s;
  width: 100%;
}

.subject:hover {
  background-color: #004999;
}
</style>
