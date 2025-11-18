import type { Shift } from './parser';

const LOCATION = "Hospital Universitario HM Torrelodones, Avenida Castillo Olivares, Torrelodones";

const TYPE_MAP: Record<string, string> = {
    'M': 'Mañana',
    'T': 'Tarde',
    'N': 'Noche',
    'Ref': 'Refuerzo'
};

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

function getColleagues(currentShift: Shift, allShifts: Shift[]): string[] {
    return allShifts
        .filter(s =>
            s.date === currentShift.date &&
            s.type === currentShift.type &&
            s.medico !== currentShift.medico
        )
        .map(s => s.medico);
}

export function generateICS(doctorShifts: Shift[], allShifts: Shift[]): string {
    const events = doctorShifts.map(shift => {
        // Determine if shift ends next day
        const startHour = parseInt(shift.startTime.split(':')[0], 10);
        const endHour = parseInt(shift.endTime.split(':')[0], 10);
        const endsNextDay = endHour < startHour;

        const start = formatICSDate(shift.date, shift.startTime);
        const end = formatICSDate(shift.date, shift.endTime, endsNextDay ? 1 : 0);
        const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        // Title: "Mañana 1 HM-Torrelodones"
        const typeName = TYPE_MAP[shift.type] || shift.type;
        const summary = `${typeName} ${shift.dayOfMonth} HM-Torrelodones`;

        // Description with colleagues
        const colleagues = getColleagues(shift, allShifts);
        let description = `Guardia de ${typeName} (${shift.startTime}-${shift.endTime}).`;
        if (colleagues.length > 0) {
            description += `\\nCompañeros: ${colleagues.join(', ')}.`;
        }

        return `BEGIN:VEVENT
UID:${shift.id}@hm-cuadrantes
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:${summary}
DESCRIPTION:${description}
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
