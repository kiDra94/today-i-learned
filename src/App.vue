<script setup>
import dayjs from 'dayjs';

const start = dayjs('2024-09-01');
const end = dayjs('2025-07-31');

const months = (from, to) => {
  const result = [];
  let current_month = from.startOf("month");
  while (current_month.isBefore(to, "month") || current_month.isSame(to, "month")){
    result.push(current_month);
    current_month = current_month.add(1, "month");
  }
  return result;
}

const days = (month) => {
  const result = [];
  let current_day = 1;
  while (current_day < month.endOf('month').date()){
    result.push(current_day);
    current_day++;
  }
  return result;
}
console.log(months(start, end));
console.log(days(start.get("month")));
</script>

<template>
  <!-- <div v-for="day in march">{{day.format('DD.MM.YY')}}</div> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
