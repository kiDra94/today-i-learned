<script setup>
import dayjs from 'dayjs';
import { resolveDynamicComponent } from 'vue';

const start = dayjs('2024-09-01');
const end = dayjs('2025-07-31');
console.log(dayjs('2024-09-30').get('date'));
const timespan_in_days = end.diff(start, 'day');

/* const generateDateRange1 = (start, end) => {
  const timespan = [];
  let day = dayjs(start);
  const endDate = dayjs(end);

  while (day.isBefore(endDate)) {
    day = day.add(1, "day");
    timespan.push(day); 
    }

  return timespan;
}; */

const generateDateRange = Array.from({ length: timespan_in_days },
  (_, i) => start.add(i, 'day'));

const formatDataRange = generateDateRange.map(date => ({
  year: date.get('year'),
  month: date.get('month') + 1,
  day: date.get('date')
}));

const groupBy = formatDataRange.reduce((acc, { year, month, day }) => {
  if (!acc[year]) {
    acc[year] = {}; 
  }
  if (!acc[year][month]) {
    acc[year][month] = []; 
  }
  acc[year][month].push(day); 
  return acc;
}, {});

console.log(generateDateRange);
console.log(formatDataRange);
console.log(groupBy);
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
