import {
  EntityDataResponse,
  MonthAvailbility,
  MonthAvailbilityFromView,
  TimeSlotsAvailbility,
  SpaceAvailabilityByYear,
  SpaceAvailabilityTimeSlot,
  SpaceSeatInformationTemp,
} from "./models/entity-model";
import {
  SortObjectByKeys,
  getDateTimeNow,
  combineDateAndTime,
  datetimeIsAfter,
  getDateString,
} from "@wotm/utils";

import { T, identity } from "./types/types";
import {
  AVAILABILITY_AVAILABLE_STATUS,
  AVAILABILITY_BOOKED_STATUS,
  EVENT_HALL_AB_MIN,
  EVENT_HALL_AB_MAX,
  ENTITY_TYPE_EH,
} from "./const";

export interface AvailabilityMonthBased {
  available: number;
  booked: number;
}

export function prepareSpaceAvailabilityDateTimeSlots(list, data): Readonly<T> {
  const availableTimeSlotsList: string[] = [];
  const notAvailableTimeSlotsList: string[] = [];
  const blockedTimeSlotsList: string[] = [];
  const lowAvailabilityTimeSlotsList: string[] = [];
  const timeSlotMap = new Map<string, number>();
  const reqDate = getDateString(data.date);
  const cTimeStamp = getDateTimeNow();

  let minNumberIndex = 1;
  // when event a & b are the candidates, need to make sure each value has at least 2 items (A, B)
  if (
    data.roomType == ENTITY_TYPE_EH &&
    data.pax >= EVENT_HALL_AB_MIN &&
    data.pax <= EVENT_HALL_AB_MAX
  ) {
    minNumberIndex = 2;
  }

  const checkedTimeSlots = new Set();
  let latestPastTimeSlot;
  for (const d of list) {
    const { startTime, endTime, date } = d;
    const slot = `${startTime}-${endTime}`;
    if (checkedTimeSlots.has(slot) || slot === latestPastTimeSlot) {
      continue;
    }

    const status = d.availabilityStatus as string;
    const availDateTime = combineDateAndTime(date, startTime);

    // if timeslot has passed, add it to notAvailableTimeSlotsList and skip future appearances.
    if (!datetimeIsAfter(availDateTime, cTimeStamp)) {
      latestPastTimeSlot = slot;
      notAvailableTimeSlotsList.push(slot);
      timeSlotMap.delete(slot);
      continue;
    }

    if (status === AVAILABILITY_AVAILABLE_STATUS) {
      if (!timeSlotMap.has(slot)) {
        timeSlotMap.set(slot, 0);
      }
      timeSlotMap.set(slot, timeSlotMap.get(slot)! + 1);
    } else {
      if (!timeSlotMap.has(slot)) timeSlotMap.set(slot, 0);
    }

    /* if number of space for that timeslot is already >= minNumberIndex, we can push it to availableTimeSlotsList.
    Add to checkedTimeSlots to skip future appearances */
    if (timeSlotMap.get(slot)! >= minNumberIndex) {
      availableTimeSlotsList.push(slot);
      checkedTimeSlots.add(slot);
      timeSlotMap.delete(slot);
    }
  }

  // Push remaining timeslots to not available
  timeSlotMap.forEach((_v, k) => {
    notAvailableTimeSlotsList.push(k);
  });

  const mInst: TimeSlotsAvailbility = {
    notAvailableTimeSlots: notAvailableTimeSlotsList,
    lowAvailableTimeSlots: lowAvailabilityTimeSlotsList,
    blockedTimeSlots: blockedTimeSlotsList,
    availableTimeSlots: availableTimeSlotsList,
  };

  const objInst: SpaceAvailabilityTimeSlot = {
    date: reqDate,
    data: mInst,
  };
  const dataResp: T = identity;
  return dataResp(objInst);
}

// TODO: Need to move to base controller to share btw child controllers
export function returnErrorResponseForRequest(msg: string): Readonly<T> {
  const dataResp: T = identity;
  const objInst = new Error(msg);
  return dataResp(objInst);
}

export function prepareSpaceAvailabilitySeatData(list) {
  const avItems = new Map();

  list.map((item) => {
    const uuid = item.uuid;
    const date = item.date;
    const startTime = item.startTime;
    const endTime = item.endTime;
    const availabilityStatus = item.availabilityStatus;
    const entityId = item.Entity.entityId;
    const areaCode = item.Entity.areaCode;
    const uuidMap = new Map();
    // Add empty Map Array for flexibility
    uuidMap["Available"] = [];
    uuidMap["Booked"] = [];
    uuidMap["Not Available"] = [];

    uuidMap[availabilityStatus] = [uuid];

    const mInst: SpaceSeatInformationTemp = {
      uuid: uuidMap,
      date: date,
      areaCode: areaCode,
      availabilityStatus: "Not yet decided",
      entityId: entityId,
      startTime: startTime,
      endTime: endTime,
    };

    if (avItems.has(entityId)) {
      const i = avItems.get(entityId);
      const ids = i.uuid;
      const idsArray = ids[availabilityStatus];
      idsArray.push(uuid);
      ids[availabilityStatus] = idsArray;
      i.uuid = ids;

      if (i.endTime < endTime) {
        i.endTime = endTime;
      }
      if (i.startTime > startTime) {
        i.startTime = startTime;
      }
      avItems.set(entityId, i);
    } else {
      avItems.set(entityId, mInst);
    }
  });

  const lObj = Array.from(avItems).reduce(
    (obj, [key, value]) => Object.assign(obj, { [key]: value }),
    {}
  );

  const l = SortObjectByKeys(lObj);
  const mapList = new Map<any, any>(Object.entries(l));

  return mapList;
}

export function prepareSpaceAvailabilityDates(list, data): Readonly<T> {
  const notAvailableDateMap = new Set<string>();
  const lowAvalabilityDateMap = new Set<string>();
  const availableDateMap = new Set<string>();
  const blockedDatesMap = new Set<string>();

  list.map((d) => {
    const d1 = new Date(d.dataValues.date);
    const date =
      d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();

    switch (d.dataValues.availabilityStatus) {
      case AVAILABILITY_AVAILABLE_STATUS:
        availableDateMap.add(date);
        if (notAvailableDateMap.has(date)) {
          notAvailableDateMap.delete(date);
        }
        break;
      case AVAILABILITY_BOOKED_STATUS:
        if (!availableDateMap.has(date)) {
          notAvailableDateMap.add(date);
        }
        break;
      default:
        break;
    }
  });

  const mInst: MonthAvailbilityFromView = {
    notAvailableDates: Array.from(notAvailableDateMap.values()),
    lowAvailableDates: Array.from(lowAvalabilityDateMap.values()),
    availableDates: Array.from(availableDateMap.values()),
    blockedDates: Array.from(blockedDatesMap.values()),
  };

  const objInst: SpaceAvailabilityByYear = {
    year: data.value,
    data: mInst,
  };

  // console.log("objInst", objInst);
  return objInst;
}

export function prepareSpaceAvailabilityData(list, data): Readonly<T> {
  const bookedDatesMap = new Map<string, Date[]>();
  const lowAvalabilityDatesMap = new Map<string, Date[]>();
  const availableDatesMap = new Map<string, Date[]>();
  const blockedDatesMap = new Map<string, Date[]>();
  list.map((d) => {
    const status = d.availabilityStatus?.toString();
    const recordDate = d.date;
    if (recordDate && (recordDate ?? false)) {
      const resd = recordDate.toLocaleString("default", { month: "short" });
      let returnList;
      switch (status) {
        case "Booked":
          returnList = updateTheMap(bookedDatesMap, d);
          bookedDatesMap.set(resd, returnList ?? []);
          break;
        case "Available":
          returnList = updateTheMap(availableDatesMap, d);
          availableDatesMap.set(resd, returnList ?? []);
          break;
        case "Blocked":
          returnList = updateTheMap(blockedDatesMap, d);
          blockedDatesMap.set(resd, returnList ?? []);
          break;
        case "LowAvailability":
          returnList = updateTheMap(lowAvalabilityDatesMap, d);
          lowAvalabilityDatesMap.set(resd, returnList ?? []);
          break;
        case undefined:
          break;
      }
    }
  });

  let requestedYear;
  if (data.durationType.toLowerCase() == "year") {
    requestedYear = data.value;
  } else {
    const s = data.value.split("/");
    requestedYear = s[0];
  }

  const mInst: MonthAvailbility = {
    notAvailableDates: getMapTOJSONString(bookedDatesMap),
    lowAvailableDates: lowAvalabilityDatesMap,
    blockedDates: blockedDatesMap,
    availableDates: getMapTOJSONString(availableDatesMap),
  };

  // const objInst: SpaceAvailabilityByYear = {
  //   year: requestedYear,
  //   data: mInst,
  // };

  const dataResp: T = identity;
  return dataResp("objInst");
}

function getMapTOJSONString(list): string {
  const jsonObject = {};
  list.forEach((value, key) => {
    jsonObject[key] = value;
  });
  return JSON.stringify(jsonObject);
}

function updateTheMap(list, data): Date[] {
  const rd = data.date.toLocaleString("default", { month: "short" });
  const aDate = data.date;
  if (aDate && (aDate ?? false)) {
    if (list.size == 0) {
      const fd = [aDate];
      list.set(rd, fd);
      return fd;
    } else {
      const exsitingvalue = list.get(rd);
      if (exsitingvalue && (exsitingvalue ?? false)) {
        const existingDates = exsitingvalue;
        existingDates.push(aDate);
        list.set(rd, existingDates);
        return existingDates;
      }
    }
  }
  return [];
}

export function mapSpaceAvailability(d): Readonly<T> {
  const objInst: SpaceAvailabilityByYear = {
    year: d.year,
    data: d.data,
  };

  const dataResp: T = identity;
  return dataResp(objInst);
}

// Post service data mapping
export function mapAvailabilityRespData(data): Readonly<T> {
  const objInst: Partial<EntityDataResponse> = {
    uuid: data.uuid,
    carPlate: data.Entity.entityId,
    date: data.date.toLocaleDateString("en-US", { timeZone: "Asia/Singapore" }),
    startTime: data.startTime,
    endTime: data.endTime,
    status: data.availabilityStatus,
    carType: data.Entity.EntityIndex.entityType,
    areaCode: data.Entity.areaCode,
    campus: data.Entity.campus,
    transportOfficer: "",
    assignedDriver: "",
    carOwner: "",
    fullAddr: data.Entity.fullAddr,
    group: data.Entity.group,
    division: data.Entity.division,
    imageLink: data.Entity.imageLink,
    remarks: data.Entity.remarks,
  };
  const dataResp: T = identity;
  return dataResp(objInst);
}
