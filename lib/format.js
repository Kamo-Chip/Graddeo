import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  toDate,
  format
} from "date-fns";

export function formatLink(text) {
  return text.replaceAll(" ", "-").toLowerCase();
}

export function formatText(text) {
  let link = "";

  if(text.includes("www")){
    link = text.split("www")[1].replace(".", "");
  }else{
    link = text.split("://")[1].replace(".", "");
  }

  if(link[link.length - 1] == "/"){
    link = link.slice(0, -1);
  }
  
  return link;
}

export function formatTextNoWWW(text) {
  let link = text.split("://")[1].replace(".", "");
  if(link[link.length - 1] == "/"){
    return link.slice(0, -1);
  }
  return link;
}
export function timeSincePosted(datePosted) {
  let time = 0;

  const fireBaseTime = convertToDate(datePosted);
  const date = toDate(fireBaseTime);
  const today = toDate(new Date());
  let daysDiff = differenceInDays(today, date);
  let hoursDiff = differenceInHours(today, date);
  let minutesDiff = differenceInMinutes(today, date);

  if (daysDiff) {
    if (daysDiff > 31) {
      time = Math.round(daysDiff / 31) + "mo";
    } else {
      time = daysDiff + "d";
    }
  } else if (minutesDiff < 60) {
    if (minutesDiff == 0) {
      time = "now";
    } else {
      time = minutesDiff + "m";
    }
  } else {
    time = hoursDiff + "h";
  }
  return time;
}

export function convertToDate(timestamp) {
  return new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
}

export function formatSalary(salary) {
  return new Intl.NumberFormat().format(salary).replaceAll(",", " ").toString();
}

export function formatDate(date) {
  return format(new Date(date), "MMM yyyy");
}
