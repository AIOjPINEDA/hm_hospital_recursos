import Papa from 'papaparse';

// --- Types ---

export type ShiftType = 'M' | 'T' | 'N' | 'Ref';

export interface Shift {
    id: string;
    date: string; // ISO YYYY-MM-DD
    dayOfMonth: number;
    dayOfWeek: string; // LUNES, MARTES...
    type: ShiftType;
    medico: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    isWeekend: boolean;
}

export interface ParseResult {
    shifts: Shift[];
    errors: string[];
}

// --- Constants ---

const DAYS_ORDER = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

// --- Helper Functions ---

function normalizeName(name: string): string {
    const clean = name.trim();
    // Fix specific case: PINEDA -> Pineda
    if (clean === 'PINEDA') return 'Pineda';
    // Fix capitalization if all caps
    if (clean === clean.toUpperCase() && clean.length > 1) {
        return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
    }
    return clean;
}

function getShiftTimes(type: ShiftType, dayOfWeek: string, isWeekend: boolean, position: number): { start: string, end: string } {
    // Logic derived from logica_cuadrante.md

    if (type === 'M') {
        // Sáb, dom y fest: AMBOS turnos de mañana entran a las 09 hs.
        if (isWeekend) {
            return position === 0
                ? { start: '09:00', end: '15:00' }
                : { start: '09:00', end: '16:00' };
        }
        // L-V
        return position === 0
            ? { start: '08:00', end: '15:00' }
            : { start: '10:00', end: '16:00' };
    }

    if (type === 'T') {
        return position === 0
            ? { start: '15:00', end: '22:00' }
            : { start: '16:00', end: '22:00' };
    }

    if (type === 'N') {
        return { start: '22:00', end: '08:00' };
    }

    if (type === 'Ref') {
        if (dayOfWeek === 'LUNES') {
            return position === 0
                ? { start: '08:00', end: '15:00' }
                : { start: '15:00', end: '22:00' };
        }
        if (isWeekend) {
            return { start: '10:00', end: '22:00' };
        }
        // Martes - Viernes
        return position === 0
            ? { start: '09:00', end: '15:00' }
            : { start: '15:00', end: '21:00' };
    }

    return { start: '00:00', end: '00:00' };
}

function detectMonthFromHeader(headerText: string): number | null {
    if (!headerText) return null;

    const clean = headerText.trim().toLowerCase();
    const monthMap: Record<string, number> = {
        'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
    };

    // Check for first 3 letters match
    for (const [key, value] of Object.entries(monthMap)) {
        if (clean.startsWith(key)) {
            return value;
        }
    }
    return null;
}

// --- Main Parser ---

export function parseCuadrante(csvContent: string): ParseResult {
    const result: ParseResult = { shifts: [], errors: [] };

    const parsed = Papa.parse(csvContent, { header: false, skipEmptyLines: false });
    const rows = parsed.data as string[][];

    if (rows.length === 0) {
        result.errors.push("El archivo está vacío");
        return result;
    }

    // 1. Detect Month from A1 (Row 0, Col 0)
    // If not found, fallback to current month or keep default logic if needed.
    // User requested: "ene = enero, dic = diciembre", year is current year.

    let monthIndex = new Date().getMonth(); // Default to current month
    const year = new Date().getFullYear(); // Always current year as requested

    const headerCell = rows[0][0];
    const detectedMonth = detectMonthFromHeader(headerCell);

    if (detectedMonth !== null) {
        monthIndex = detectedMonth;
    }

    // Locate header row (LUNES, MARTES...)
    let headerRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i][1] === 'LUNES') {
            headerRowIndex = i;
            break;
        }
    }

    if (headerRowIndex === -1) {
        result.errors.push("No se encontró la fila de cabecera (LUNES, MARTES...)");
        return result;
    }

    // Process blocks of 5 rows
    // Structure: [Days, M, Ref, T, N]
    // We iterate looking for the "Days" row (row with numbers)

    let currentWeekRow = headerRowIndex + 1;

    while (currentWeekRow < rows.length) {
        // 1. Identify the "Days" row
        // It should have numbers in columns 1-7 (indices)
        const daysRow = rows[currentWeekRow];
        if (!daysRow) break;

        // Check if it's a valid week block start (has numbers)
        const hasNumbers = daysRow.slice(1, 8).some(cell => !isNaN(parseInt(cell)) || cell.includes('-'));

        if (!hasNumbers) {
            // Maybe it's an empty row or notes, skip
            currentWeekRow++;
            continue;
        }

        // We assume the next 4 rows are M, Ref, T, N
        const mRow = rows[currentWeekRow + 1];
        const refRow = rows[currentWeekRow + 2];
        const tRow = rows[currentWeekRow + 3];
        const nRow = rows[currentWeekRow + 4];

        if (!mRow || !refRow || !tRow || !nRow) break;

        // Process each day of the week (Cols 1 to 7 -> B to H)
        for (let col = 1; col <= 7; col++) {
            const dayCell = daysRow[col];
            if (!dayCell) continue;

            // Parse day number
            let dayNum = parseInt(dayCell);
            // Handle "31-Oct" format if present, or just ignore if not current month
            // For simplicity, if it's not a simple number, we might need regex
            // But the CSV usually has "1", "2", etc.
            // If it has "31-Oct", parseInt might return 31. We need to be careful about previous month.
            // Heuristic: If we are in the first week and see > 20, it's previous month.

            if (isNaN(dayNum)) {
                // Try regex for "31-Oct"
                const match = dayCell.match(/^(\d+)/);
                if (match) dayNum = parseInt(match[1]);
            }

            if (!dayNum || isNaN(dayNum)) continue;

            // Filter out previous/next month days
            // If we are parsing Nov (monthIndex 10), and we see 30 or 31 in the first row, skip.
            if (currentWeekRow === headerRowIndex + 1 && dayNum > 20) continue;
            // If we are in last rows and see 1 or 2, skip.
            if (currentWeekRow > headerRowIndex + 15 && dayNum < 10) continue;

            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayOfWeek = DAYS_ORDER[col - 1];
            const isWeekend = dayOfWeek === 'SABADO' || dayOfWeek === 'DOMINGO';

            // Process Shifts
            const processShiftRow = (row: string[], type: ShiftType) => {
                const cellContent = row[col];
                if (!cellContent) return;

                const names = cellContent.split('/').map(normalizeName).filter(n => n.length > 0);

                names.forEach((name, index) => {
                    const times = getShiftTimes(type, dayOfWeek, isWeekend, index);

                    result.shifts.push({
                        id: `${dateStr}-${type}-${index}-${name}`,
                        date: dateStr,
                        dayOfMonth: dayNum,
                        dayOfWeek,
                        type,
                        medico: name,
                        startTime: times.start,
                        endTime: times.end,
                        isWeekend
                    });
                });
            };

            processShiftRow(mRow, 'M');
            processShiftRow(refRow, 'Ref');
            processShiftRow(tRow, 'T');
            processShiftRow(nRow, 'N');
        }

        // Jump to next block
        currentWeekRow += 5;
    }

    return result;
}
