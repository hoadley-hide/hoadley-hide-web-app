import Vue from "vue";
import { DateTime, Duration } from "luxon";

export const dateHelper = (
  inDate: Date | DateTime | string | undefined
): DateTime | string => {
  if (!inDate) {
    return "";
  }

  if (DateTime.isDateTime(inDate)) {
    return inDate;
  }

  let dt: DateTime;

  dt = DateTime.fromJSDate(inDate as Date);

  if (dt.invalidExplanation || dt.invalidReason) {
    dt = DateTime.fromISO(inDate as string);
    if (dt.invalidExplanation || dt.invalidReason) {
      return dt.invalidExplanation || dt.invalidReason || "";
    }
  }

  dt.setLocale("en-AU");

  return dt;
};

Vue.filter(
  "date",
  function (inDate: Date | string | undefined, format: "ymd" | "dmy") {
    const dt: DateTime | string = dateHelper(inDate);
    if (typeof dt === "string") {
      return dt;
    }

    switch (format) {
      case "ymd":
        return dt.toISODate();
      default:
        return dt.toLocaleString(DateTime.DATE_SHORT);
    }
  }
);

Vue.filter("datetime", function (inDate: Date | string | undefined) {
  const dt: DateTime | string = dateHelper(inDate);
  if (typeof dt === "string") {
    return dt;
  }

  return dt.toLocaleString({
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
  });
});

export function durationFilter(
  inDate: string | Date | DateTime,
  options: boolean | { nice: boolean; long: boolean } = true
) {
  const niceText =
    options === true || (typeof options === "object" && options?.nice);
  const longText = typeof options === "object" && options?.long;

  const dt: DateTime | string = dateHelper(inDate);
  if (typeof dt === "string") {
    return dt;
  }

  let d: Duration = dt.diffNow();

  // Date is in the future.
  const future = d.milliseconds > 0;

  d = future ? d : d.negate();
  d = d.shiftTo("years", "months", "days", "hours", "minutes", "seconds");

  const dur = d.toObject();
  let pp: string[] = [];

  const showYears = Number(dur.years) > 0;
  const showMonths = Number(dur.months) > 0;
  const showDays = Number(dur.days) > 0 && !showYears;
  const showHours = Number(dur.hours) > 0 && !showYears && !showMonths;
  const showMinutes =
    Number(dur.minutes) > 0 && !showYears && !showMonths && !showDays;
  const lessThanOneMinute =
    Number(dur.seconds) > 0 &&
    !showYears &&
    !showMonths &&
    !showDays &&
    !showHours &&
    !showMinutes;

  const units = longText
    ? {
        y: " years",
        m: " months",
        d: " days",
        h: " hours",
        min: " minutes",
      }
    : {
        y: "y",
        m: "m",
        d: "d",
        h: "h",
        min: "m",
      };

  if (future && niceText && !lessThanOneMinute) {
    pp.push("in");
  }
  if (showYears) {
    pp.push(`${dur.years?.toFixed(0)}${units.y}`);
  }
  if (showMonths) {
    pp.push(`${dur.months?.toFixed(0)}${units.m}`);
  }
  if (showDays) {
    pp.push(`${dur.days?.toFixed(0)}${units.d}`);
  }
  if (showHours) {
    pp.push(`${dur.hours?.toFixed(0)}${units.h}`);
  }
  if (showMinutes) {
    pp.push(`${dur.minutes?.toFixed(0)}${units.min}`);
  }
  if (lessThanOneMinute) {
    pp.push(`Just now`);
  }
  if (!future && niceText && !lessThanOneMinute) {
    pp.push("ago");
  }
  return pp.join(" ");
}
Vue.filter("duration", durationFilter);

Vue.filter("capitalize", function (value: string | undefined) {
  if (!value) {
    return "";
  }
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("phone", function (inPhone: string | undefined) {
  if (!inPhone) {
    return "";
  }

  inPhone.replace(/[^\d]/, "");

  if (inPhone.length === 8) {
    return inPhone.replace(/(\d{4})(\d{4})/, "$1 $2");
  }
  if (inPhone.length === 10) {
    return inPhone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  if (inPhone.length === 11) {
    return inPhone.replace(/61(\d{3})(\d{3})(\d{3})/, "+61$1 $2 $3");
  }
});
