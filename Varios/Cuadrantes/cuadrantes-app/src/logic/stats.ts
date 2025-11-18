import type { Shift } from './parser';

export interface DoctorStats {
    doctorName: string;
    totalShifts: number;
    totalRealHours: number;
    totalComputedHours: number;
    nightShifts: number;
    weekendShifts: number;
    shiftsByType: Record<string, number>;
}

/**
 * Calculates the duration of a shift in hours.
 * Handles shifts crossing midnight (e.g., 22:00 - 08:00).
 */
export function calculateShiftDuration(start: string, end: string): number {
    const startHour = parseInt(start.split(':')[0], 10);
    let endHour = parseInt(end.split(':')[0], 10);

    if (endHour < startHour) {
        endHour += 24;
    }

    return endHour - startHour;
}

/**
 * Calculates statistics for a specific doctor given a list of shifts.
 */
export function getDoctorStats(shifts: Shift[], doctorName: string): DoctorStats {
    const doctorShifts = shifts.filter(s => s.medico === doctorName);

    let totalRealHours = 0;
    let nightShifts = 0;
    let weekendShifts = 0;
    const shiftsByType: Record<string, number> = { M: 0, T: 0, N: 0, Ref: 0 };

    doctorShifts.forEach(shift => {
        // Count types
        shiftsByType[shift.type] = (shiftsByType[shift.type] || 0) + 1;

        // Count specific attributes
        if (shift.type === 'N') nightShifts++;
        if (shift.isWeekend) weekendShifts++;

        // Calculate real hours
        totalRealHours += calculateShiftDuration(shift.startTime, shift.endTime);
    });

    // Computed Hours Logic: Real Hours + (7 hours * Number of Night Shifts)
    const totalComputedHours = totalRealHours + (nightShifts * 7);

    return {
        doctorName,
        totalShifts: doctorShifts.length,
        totalRealHours,
        totalComputedHours,
        nightShifts,
        weekendShifts,
        shiftsByType
    };
}

/**
 * Calculates statistics for all doctors found in the shifts.
 */
export function getAllDoctorsStats(shifts: Shift[]): DoctorStats[] {
    const uniqueDoctors = Array.from(new Set(shifts.map(s => s.medico))).sort();
    return uniqueDoctors.map(doc => getDoctorStats(shifts, doc));
}
