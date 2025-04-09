<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/de';

const from = dayjs("2024-09-05 08:00");
const to = dayjs("2025-07-07 08:00");
const today = dayjs();
const is_today = (day) => day.isSame(today, "day");
const weekend = (day) => day.day() == 0 || day.day() == 6; // 0 SO, 6 SA
const past = (day) => day.isBefore(today, "day");

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
    const special_class = [
      is_today(current_day) ? "today_css" : "",
      past(current_day) ? "past_css" : "",
      weekend(current_day) ? "weekend_css" : "",
    ].join(" ");
    result.push({ current_day, special_class });
    current_day = current_day.add(1, "day");
  }
  return result;
}

</script>

<template>

  <div class="container">
    <div class="month" v-for="month in months(from, to)" :key="month.format('YYYY-MM')">
      <h3>{{ month.format("MMM") }}</h3>
      <div class="days">
        <div class="day" :class="date.special_class" v-for="date in days(month)"
          :key="date.current_day.format('YYYY-MM-DD')">
          {{ date.current_day.format("ddd, DD") }}
        </div>
      </div>
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

.weekend_css .past_css {
  background-color: beige;
}
</style>