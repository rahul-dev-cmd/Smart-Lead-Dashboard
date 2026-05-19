type CsvValue = string | number | Date | null | undefined;

const escapeCsvValue = (value: CsvValue): string => {
  const normalized = value instanceof Date ? value.toISOString() : String(value ?? "");
  return /[",\n\r]/.test(normalized) ? `"${normalized.replace(/"/g, '""')}"` : normalized;
};

export const toCsv = (headers: string[], rows: CsvValue[][]): string => {
  const headerLine = headers.map(escapeCsvValue).join(",");
  const rowLines = rows.map((row) => row.map(escapeCsvValue).join(","));
  return [headerLine, ...rowLines].join("\n");
};
