<script setup>
import dayjs from 'dayjs';
import { resolveDynamicComponent } from 'vue';

const start = dayjs('2024-09-01');
const end = dayjs('2025-07-31');
console.log(dayjs('2024-09-30').get('day'));
console.log(end.diff(start, 'month'));
const timespan = [];
let day = start;
const diffInMonth = end.diff(start, 'month');
let dayOld = day;
// group by function
// probier auch gleich beim ersten durchlauf ein dictonary zu machen,
// wo .get('month') der key ist !!!
while (day < end) {
  let month = [];
  if (dayOld.get('month') === day.get('month')) {
    day = day.add(1, 'day');
    month.push(day);

  } else {
    console.log(month);
    timespan.push(month);
    break;
  }
}
const march = Array.from({ length: 31 },
  (_, i) => dayjs('20025-03-01').add(i, 'day'));
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
