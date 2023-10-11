import { getDateTimeWithTimezone } from "src/shared/helpers/date-time-with-timezone.helper";
import { percentage } from "src/shared/helpers/percentage.helper";
import { millisecondsToTime } from "./milliseconds-to-time.helper";

export function remainingTime(totalMinutes: number, startDateHour: Date, endDateHour: Date, currentDateHour: Date = getDateTimeWithTimezone()) {
    const remaining_time = endDateHour.getTime() - currentDateHour.getTime();
    const test_time = currentDateHour.getTime() - new Date(startDateHour).getTime();
    const test_time_current_minutes = (new Date(test_time).getUTCHours() * 60) + new Date(test_time).getUTCMinutes();

    return {
        remaining_time: millisecondsToTime(remaining_time),
        test_time_percentage: percentage(test_time_current_minutes, totalMinutes)
    };
}

