<script setup>
defineProps({
  month: { type: Object, required: true },
  days: { type: Array, required: true },
});

const emit = defineEmits(["select-day"]);
</script>

<template>
  <div class="month">
    <h3>{{ month.format("MMM") }}</h3>
    <div class="days">
      <div
        v-for="date in days"
        :key="date.current_day.format('YYYY-MM-DD')"
        class="day"
        :class="date.special_class"
        @click="emit('select-day', date.current_day)"
      >
        {{ date.current_day.format("ddd, DD") }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.month {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #fdfdfd;
  margin-bottom: 1rem;
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

.selecetedSubject_css {
  background-color: #ccccff;
  border-color: #0000cc;
  font-weight: bold;
  opacity: 1 !important;
  filter: none !important;
  color: inherit;
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
</style>
