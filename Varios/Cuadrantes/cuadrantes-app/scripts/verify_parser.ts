import fs from 'fs';
import path from 'path';
import { parseCuadrante } from '../src/logic/parser';

// Path to the CSV file
const CSV_PATH = '/Users/jaimepm/Library/Mobile Documents/com~apple~CloudDocs/Work/HM Hospital/Varios/Cuadrantes/11-2025 Final CSV.csv';

try {
    console.log(`Reading file from: ${CSV_PATH}`);
    const content = fs.readFileSync(CSV_PATH, 'utf-8');

    console.log('Parsing content...');
    const result = parseCuadrante(content);

    console.log('--- Parsing Result ---');
    console.log(`Total Shifts Found: ${result.shifts.length}`);
    console.log(`Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
        console.error('Errors found:', result.errors);
    }

    // Group by Doctor
    const shiftsByDoctor: Record<string, number> = {};
    result.shifts.forEach(s => {
        shiftsByDoctor[s.medico] = (shiftsByDoctor[s.medico] || 0) + 1;
    });

    console.log('\n--- Shifts per Doctor ---');
    Object.entries(shiftsByDoctor).sort().forEach(([doc, count]) => {
        console.log(`${doc}: ${count} shifts`);
    });

    // Sample Check: Nov 3rd (Monday)
    console.log('\n--- Sample Check: Nov 3rd (Monday) ---');
    const nov3Shifts = result.shifts.filter(s => s.dayOfMonth === 3);
    nov3Shifts.forEach(s => {
        console.log(`[${s.type}] ${s.medico} (${s.startTime}-${s.endTime})`);
    });

} catch (error) {
    console.error('Error reading or parsing file:', error);
}
