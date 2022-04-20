import { Plugin, Getter, IDependency } from "@devexpress/dx-react-core";
import { memo } from "react";

const pluginDependencies: IDependency[] = [
  { name: "MonthView" },
  { name: "IntegratedGrouping", optional: true }
];

const maxBoundaryPredicate = (maxBoundary: any, startDate: any) =>
  maxBoundary.isBefore(startDate, "day") ||
  (isMidnight(maxBoundary) && maxBoundary.isSame(startDate, "day"));

const byDayPredicate = (boundary: any, date: any) =>
  boundary.isSameOrAfter(date, "day") &&
  !boundary.isSame(boundary.clone().startOf("day"));

const isMidnight = (date: any) => date.isSame(date.clone().startOf("day"));

const compareByDay = (first: any, second: any) => {
  if (first.start.isBefore(second.start, "day")) return -1;
  if (first.start.isAfter(second.start, "day")) return 1;
  return 0;
};

const compareByAllDay = (first: any, second: any) => {
  if (first.allDay && !second.allDay) return -1;
  if (!first.allDay && second.allDay) return 1;
  return 0;
};

const compareByTime = (first: any, second: any) => {
  if (first.start.isBefore(second.start)) return -1;
  if (first.start.isAfter(second.start)) return 1;
  if (first.end.isBefore(second.end)) return 1;
  if (first.end.isAfter(second.end)) return -1;
  return 0;
};

export const sortAppointments = (appointments: any) =>
  appointments
    .slice()
    .sort(
      (a: any, b: any) =>
        compareByDay(a, b) || compareByAllDay(a, b) || compareByTime(a, b)
    );

export const findOverlappingAppointments = (
  sortedAppointments: any,
  byDay = false
) => {
  const appointments = sortedAppointments.slice();
  const groups = [];
  let totalIndex = 0;

  while (totalIndex < appointments.length) {
    groups.push([]);
    const current: any = appointments[totalIndex];
    const currentGroup: any = groups[groups.length - 1];
    let next = appointments[totalIndex + 1];
    let maxBoundary = current.end;

    currentGroup.push(current);
    totalIndex += 1;
    while (
      next &&
      (maxBoundary.isAfter(next.start) ||
        (byDay && byDayPredicate(maxBoundary, next.start)))
    ) {
      currentGroup.push(next);
      if (maxBoundary.isBefore(next.end)) maxBoundary = next.end;
      totalIndex += 1;
      next = appointments[totalIndex];
    }
  }
  return groups;
};

export const adjustAppointments = (groups: any, byDay = false) =>
  groups.reduce((acc: any, items: any) => {
    let offset = 0;
    const appointments = items.map((appointment: any) => ({ ...appointment }));
    const groupLength = appointments.length;
    for (let startIndex = 0; startIndex < groupLength; startIndex += 1) {
      const appointment = appointments[startIndex];
      if (appointment.offset === undefined) {
        let maxBoundary = appointment.end;
        appointment.offset = offset;
        for (let index = startIndex + 1; index < groupLength; index += 1) {
          if (appointments[index].offset === undefined) {
            if (
              (!byDay &&
                maxBoundary.isSameOrBefore(appointments[index].start)) ||
              (byDay &&
                maxBoundaryPredicate(maxBoundary, appointments[index].start))
            ) {
              maxBoundary = appointments[index].end;
              appointments[index].offset = offset;
            }
          }
        }

        offset += 1;
      }
    }
    return [...acc, ...appointments];
  }, []);

const filterAppointments = ({ timeTableAppointments, currentView }: any) => {
  if (currentView.type !== "month") {
    return timeTableAppointments;
  }
  const sortedAppointments = timeTableAppointments.map(sortAppointments);
  const groupedAppointments = sortedAppointments.map((sortedGroup: any) =>
    findOverlappingAppointments(sortedGroup, true)
  );
  const adjustedAppointments = groupedAppointments.map((group: any) =>
    adjustAppointments(group, true)
  );
  const filteredAppointments = adjustedAppointments.map((appointments: any) => {
    return appointments.filter((appointment: any) => appointment.offset < 1)
  }

  );

  const arr = filteredAppointments.map((appointmentGroup: any) =>
    appointmentGroup.map(({ offset, ...restProps }: any) => ({ ...restProps }))
  );

  return (
    <>
      <div>{arr}</div>
      <div>show more</div>
    </>
  );
};

export const IntegratedAppointments = memo(() => {
  return (
    <Plugin name="IntegratedAppointments" dependencies={pluginDependencies}>
      <Getter name="timeTableAppointments" computed={filterAppointments} />

    </Plugin>
  );
})