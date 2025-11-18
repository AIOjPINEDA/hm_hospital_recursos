import type { Shift } from './parser';

const LOCATION = "University Hospital HM, Av. Castillo Olivares, s/n, 28250 Torrelodones, Madrid";

/**
 * Formats a date string (YYYY-MM-DD) and time (HH:mm) into ICS format (YYYYMMDDTHHMMSS)
 */
function formatICSDate(dateStr: string, timeStr: string, addDays: number = 0): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    const date = new Date(year, month - 1, day, hour, minute);
    if (addDays > 0) {
        date.setDate(date.getDate() + addDays);
    }

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${y}${m}${d}T${h}${min}00`;
}

export function generateICS(shifts: Shift[]): string {
    const events = shifts.map(shift => {
        // Determine if shift ends next day (e.g. Night shift 22:00 - 08:00)
        const startHour = parseInt(shift.startTime.split(':')[0], 10);
        const endHour = parseInt(shift.endTime.split(':')[0], 10);
        const endsNextDay = endHour < startHour;

        const start = formatICSDate(shift.date, shift.startTime);
        const end = formatICSDate(shift.date, shift.endTime, endsNextDay ? 1 : 0);
        const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        return `BEGIN:VEVENT
UID:${shift.id}@hm-cuadrantes
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:Guardia HM: Turno ${shift.type}
DESCRIPTION:Guardia de tipo ${shift.type} asignada a ${shift.medico}.
LOCATION:${LOCATION}
STATUS:CONFIRMED
END:VEVENT`;
    }).join('\n');

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HM Cuadrantes//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${events}
END:VCALENDAR`;
}
