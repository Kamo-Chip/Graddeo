import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  toDate,
  format
} from "date-fns";
import daysToWeeks from "date-fns/daysToWeeks";

export function formatLink(text) {
  return text.replaceAll(" ", "-").toLowerCase();
}

export function formatTextRemoveSpaces(text) {
  return text.replaceAll(" ", "")
}

export function formatText(text) {
  // let link = "";

  // if(text.length == 1 || text == "" || (!text.includes("www") && !text.includes("://"))) {
  //   return text;
  // }
  
  // if(text.includes("www")){
  //   link = text.split("www")[1].replace(".", "");
  // }else if(text.includes("://")){
  //   link = text.split("://")[1].replace(".", "");
  // }

  if(text[text.length - 1] == "/"){
    text = text.slice(0, -1);
  }
  
  return text;
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

export function formatDateDayMonthYear(date) {
  return format(new Date(date), "dd MMM yyyy")
}

export function formatDateDayMonth(date) {
  return format(new Date(date), "dd MMM");
}

export function capitaliseFirst(text) {
  if(!text) {
    return;
  }
  return text[0].toUpperCase().concat(text.substring(1, text.length).toLowerCase());
}

export function checkLink(link) {
  let isValid = true;
  if (link.includes("https://") || link.includes("http://")) {
    isValid = false;
  }
  return isValid;
};

export function formatPhoneNumber(number) {
  if(!number){
    return;
  }
  return number.substring(0, 3).concat(" " + number.substring(3, 6)). concat(" " + number.substring(6, 10))
}