import { DateTime } from "luxon";
import { useEffect } from "react";

export function findById(array, id) {
  return array.find((element) => element.id === id);
}

export function replaceById(array, elementToReplace) {
  const newArray = [];
  array.forEach((element) => {
    if (element.id === elementToReplace.id) newArray.push(elementToReplace);
    else newArray.push(element);
  });
  return newArray;
}

export function deleteById(array, idToDelete) {
  const newArray = [];
  array.forEach((element) => {
    if (element.id !== idToDelete) newArray.push(element);
  });
  return newArray;
}

export function deleteByValue(array, valueToDelete) {
  const newArray = [];
  array.forEach((element) => {
    if (element !== valueToDelete) newArray.push(element);
  });
  return newArray;
}

export function formatDate(date, format = DateTime.DATE_MED_WITH_WEEKDAY) {
  return DateTime.fromISO(date).toLocaleString(format);
}

export function formatWeek(startOfWeek) {
  startOfWeek = DateTime.fromISO(startOfWeek);
  const endOfWeek = startOfWeek.endOf("week");
  const options = { month: "short", day: "2-digit", year: "2-digit" };
  return `${startOfWeek.toLocaleString(options)} - ${endOfWeek.toLocaleString(
    options
  )}`;
}

export function formatMonth(date) {
  return DateTime.fromISO(date).toLocaleString({
    month: "short",
    year: "numeric",
  });
}

export function formatYear(date) {
  return DateTime.fromISO(date).toLocaleString({ year: "numeric" });
}

export function formatServerDate(date) {
  return date.toISOString().split("T")[0];
}

export function timeFrom(date) {
  return DateTime.fromISO(date).toRelative(date);
}

export function getBlocks(htmlString) {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();

  const children = Array.from(template.content.children);

  return children.map((child) => child.outerHTML);
}

export const useDebouncedEffect = (effect, deps, delay) => {
  // Copied from https://stackoverflow.com/a/61127960/6351440
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

export function getEntriesCountDisplay(count) {
  return `${count} ${count === 1 ? "entry" : "entries"}`;
}
