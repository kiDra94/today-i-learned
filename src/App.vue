<script setup>
import dayjs from 'dayjs';

const start = dayjs('2024-09-01');
const end = dayjs('2025-07-31');

const months = (from, to) => {
  const result = [];
  let current_month = from.startOf("month");
  while (current_month.isBefore(to, "month") || current_month.isSame(to, "month")) {
    result.push(current_month);
    current_month = current_month.add(1, "month");
  }
  return result;
}

const days = (month) => {
  const result = [];
  let current_day = month.startOf("month");
  const to = month.endOf("month");
  while (current_day.isBefore(to, "day") || current_day.isSame(to, "day")) {
    result.push(current_day);
    current_day = current_day.add(1, "day");
  }
  return result;
}
console.log(months(start, end));
console.log(days(start));
</script>

<template>
  <div class="container">
    <div class="month" v-for="month in months(start, end)">
    <h3>{{ month.format("MMMM") }}</h3>
    <div class="day" v-for="day in days(month)">{{ day.format("ddd, DD") }}</div>
  </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100vw; 
  height: 100vh;
  font-family: 'Roboto';
}

.month {
  margin: 0.5em;
  padding: 0.3em;
  width: 100vw; 
  height: 100vh;
}

.day {
  margin: 0.1em;
  border: 1px solid black;
  padding: 2px;
}
</style>
