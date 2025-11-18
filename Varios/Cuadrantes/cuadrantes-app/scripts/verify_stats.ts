import { getDoctorStats, calculateShiftDuration } from '../src/logic/stats';
import { Shift } from '../src/logic/parser';

// Mock Data
const mockShifts: Shift[] = [
    {
        id: '1',
        date: '2025-11-01',
        dayOfMonth: 1,
        dayOfWeek: 'LUNES',
        type: 'M',
        medico: 'Dr. Test',
        startTime: '08:00',
        endTime: '15:00', // 7 hours
        isWeekend: false
    },
    {
        id: '2',
        date: '2025-11-02',
        dayOfMonth: 2,
        dayOfWeek: 'MARTES',
        type: 'N',
        medico: 'Dr. Test',
        startTime: '22:00',
        endTime: '08:00', // 10 hours
        isWeekend: false
    }
];

console.log('--- Verifying Stats Logic ---');

// 1. Test Duration Calculation
const durationM = calculateShiftDuration('08:00', '15:00');
console.log(`Duration 08-15 (Expected 7): ${durationM} -> ${durationM === 7 ? 'PASS' : 'FAIL'}`);

const durationN = calculateShiftDuration('22:00', '08:00');
console.log(`Duration 22-08 (Expected 10): ${durationN} -> ${durationN === 10 ? 'PASS' : 'FAIL'}`);

// 2. Test Computed Hours
const stats = getDoctorStats(mockShifts, 'Dr. Test');

console.log('\n--- Doctor Stats for Dr. Test ---');
console.log(`Total Real Hours: ${stats.totalRealHours}`);
console.log(`  - Shift M: 7h`);
console.log(`  - Shift N: 10h`);
console.log(`  - Expected: 17h -> ${stats.totalRealHours === 17 ? 'PASS' : 'FAIL'}`);

console.log(`\nTotal Computed Hours: ${stats.totalComputedHours}`);
console.log(`  - Formula: Real (17) + (Nights (1) * 7)`);
console.log(`  - Expected: 24h -> ${stats.totalComputedHours === 24 ? 'PASS' : 'FAIL'}`);

console.log(`\nNight Shifts: ${stats.nightShifts} -> ${stats.nightShifts === 1 ? 'PASS' : 'FAIL'}`);
