import { ulid } from "ulid";
import { DateTime } from "luxon";

export function dateString(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export function getDayIndex(date) {
    const falseIndex = date.getDay();
    return falseIndex == 0 ? 6 : falseIndex - 1;
}

const dayInMillis = 1000 * 60 * 60 * 24;

export function addDays(date, number) {
    return new Date(date.getTime() + number * dayInMillis);
}

export function weekStartOf(dateString) {
    const date = DateTime.fromISO(dateString);
    const offset = date.weekday - 1;
    return date.minus({days: offset});
}

export function formatDate(dateString) {
    const date = DateTime.fromISO(dateString);
    return date.toLocaleString(DateTime.DATE_MED);
}

export function generateId(dateString) {
    const date = DateTime.fromISO(dateString);
    return ulid(date.toMillis());
}