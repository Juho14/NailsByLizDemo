export const formatDateBackend = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatDateLocale = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}.${month}.${year}`;
};

export const formatReservationTimeslot = (reservation) => {
    const startTime = new Date(reservation.startTime + "Z");
    const endTime = new Date(reservation.endTime + "Z");
    return `${formatTimeHHMM(startTime)} - ${formatTimeHHMM(endTime)}`;
}

export const adjustTimeForTimezone = (time) => {
    const date = new Date(time);
    const timezoneOffset = isDaylightSavingTime(date) ? 180 : 120; // Offset in minutes, 180 for DST, 120 for non-DST
    const localTime = new Date(date.getTime() + (timezoneOffset * 60000)); // Adjust for timezone offset
    return localTime;
};

export const adjustTimeToGMT = (time) => {
    const date = new Date(time);
    const timezoneOffset = isDaylightSavingTime(date) ? 180 : 120; // Offset in minutes, 180 for DST, 120 for non-DST
    const adjustedTime = new Date(date.getTime() - (timezoneOffset * 60000)); // Adjust for timezone offset
    return adjustedTime;
};

export const formatTimeHHMM = (time) => {
    const formattedTime = displayTimeWithDST(time);
    const hours = String(formattedTime.getHours()).padStart(2, '0');
    const minutes = String(formattedTime.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};


export const adjustTimeForDST = (time, isDST) => {
    // Logic to adjust time for DST if necessary
    if (isDST) {
        // Add an hour for DST
        return new Date(time.getTime() + (60 * 60 * 1000));
    } else {
        return time; // Return the original time if not in DST
    }
};

export const isDaylightSavingTime = (date) => {
    const year = date.getFullYear();
    const springDST = getLastSundayOfMarch(year);
    const fallDST = getLastSundayOfOctober(year);
    // Check if the date falls within the DST period
    return date.getTime() >= springDST.getTime() && date.getTime() < fallDST.getTime();
};


// Helper function to get the last Sunday of March
const getLastSundayOfMarch = (year) => {
    const lastDayOfMarch = new Date(year, 3, 0);
    const dayOfWeek = lastDayOfMarch.getDay();
    return new Date(year, 2, 31 - dayOfWeek);
};

// Helper function to get the last Sunday of October
const getLastSundayOfOctober = (year) => {
    const lastDayOfOctober = new Date(year, 10, 0);
    const dayOfWeek = lastDayOfOctober.getDay();
    return new Date(year, 9, 31 - dayOfWeek);
};

export const displayTimeWithDST = (time) => {
    // Function to display the time with an extra hour if not during DST
    const displayDate = new Date(time);
    if (!isDaylightSavingTime(displayDate)) {
        displayDate.setHours(displayDate.getHours() + 1);
    }
    return displayDate;
};

export const getMonday = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
};