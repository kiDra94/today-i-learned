<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/de';

const from = dayjs('2024-09-01');
const to = dayjs('2025-07-31');

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
console.log(months(form, to));
console.log(days(from));
</script>

<template>
  <div class="container">
    <div class="month" v-for="month in months(from, to)">
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
}

.month {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  overflow: hidden;
}

h3 {
  margin: 10px 0;
  font-size: 1.2rem;
}

.days {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  align-content: flex-start;
  padding: 5px;
  overflow-y: auto;
}

.day {
  width: 100%;
  display: flex;
  background-color: #f3f3f3;
  border: 1px solid #ddd;
  font-size: 0.9rem;
}

.today_css {
  background-color: red;
}

.past_css {
  background-color: blue;
}

.weekend_css {
  background-color: green;
}

.weekend_css .past_css{
  background-color: beige;
}
</style>
