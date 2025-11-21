// src/composables/useCalendar.js
import { computed } from "vue";
import dayjs from "dayjs";

export function useCalendar(from, to, tilsByDay, selectedSubjects) {
  const today = dayjs();

  const isToday = (day) => day.isSame(today, "day");
  const isWeekend = (day) => day.day() === 0 || day.day() === 6;
  const isPast = (day) => day.isBefore(today, "day");

  // Generate months between from and to
  const months = computed(() => {
    const result = [];
    let current = from.startOf("month");
    while (current.isBefore(to, "month") || current.isSame(to, "month")) {
      result.push(current);
      current = current.add(1, "month");
    }
    return result;
  });

  // Generate days for a month with CSS classes
  function getDaysForMonth(month, events) {
    const result = [];
    let currentDay = month.startOf("month");
    const endDay = month.endOf("month");

    while (currentDay.isBefore(endDay, "day") || currentDay.isSame(endDay, "day")) {
      const dateKey = currentDay.format("YYYY-MM-DD");
      const hasEvent = events.some((event) => event.date === dateKey);
      const subjectsForDay = tilsByDay.value[dateKey] || [];
      const hasSelectedSubject = selectedSubjects.value.some((subject) =>
        subjectsForDay.includes(subject)
      );

      const classes = [
        isToday(currentDay) ? "today_css" : "",
        isPast(currentDay) ? "past_css" : "",
        isWeekend(currentDay) ? "weekend_css" : "",
        hasEvent ? "event_css" : "",
        hasSelectedSubject ? "selecetedSubject_css" : "",
      ]
        .filter(Boolean)
        .join(" ");

      result.push({
        current_day: currentDay,
        special_class: classes,
      });

      currentDay = currentDay.add(1, "day");
    }

    return result;
  }

  return {
    months,
    getDaysForMonth,
  };
}
