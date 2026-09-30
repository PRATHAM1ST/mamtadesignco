import {useState} from 'react';
import {Modal} from '../ui/Modal';

type Measurements = {columns: string[]; rows: string[][]};
type Guide = {cm?: Measurements; inches?: Measurements; notes?: string; instructions?: string};

function table(value: unknown): Measurements | undefined {
  if (!value || typeof value !== 'object') return;
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.columns) || !data.columns.length || !data.columns.every((cell) => typeof cell === 'string')) return;
  if (!Array.isArray(data.rows) || !data.rows.every((row) => Array.isArray(row) && row.length === (data.columns as string[]).length && row.every((cell) => typeof cell === 'string'))) return;
  return {columns: data.columns as string[], rows: data.rows as string[][]};
}

export function parseSizeGuide(value?: string | null): Guide | null {
  if (!value) return null;
  try {
    const data: unknown = JSON.parse(value);
    if (!data || typeof data !== 'object') return null;
    const fields = data as Record<string, unknown>;
    const cm = table(fields.cm);
    const inches = table(fields.inches);
    if (!cm && !inches) return null;
    return {cm, inches, notes: typeof fields.notes === 'string' ? fields.notes : undefined, instructions: typeof fields.instructions === 'string' ? fields.instructions : undefined};
  } catch {return null;}
}

export function SizeGuide({guide}: {guide: Guide}) {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<'cm' | 'inches'>(guide.inches ? 'inches' : 'cm');
  const measurement = guide[unit];
  return (
    <>
      <button className="text-button size-guide-trigger" type="button" onClick={() => setOpen(true)}>Size & fit guide <span aria-hidden="true">↗</span></button>
      <Modal open={open} onClose={() => setOpen(false)} title="Size & fit" className="size-guide-modal">
        {!!guide.cm && !!guide.inches && <div className="unit-switch" aria-label="Measurement unit">
          {(['inches', 'cm'] as const).map((value) => <button key={value} type="button" aria-pressed={value === unit} onClick={() => setUnit(value)}>{value}</button>)}
        </div>}
        {measurement && <div className="size-guide-table-wrap"><table className="size-guide-table"><caption>Garment measurements in {unit}</caption>
          <thead><tr>{measurement.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
          <tbody>{measurement.rows.map((row) => <tr key={row.join('|')}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={measurement.columns[cellIndex]} scope="row">{cell}</th> : <td key={measurement.columns[cellIndex]}>{cell}</td>)}</tr>)}</tbody>
        </table></div>}
        {guide.notes && <p className="size-guide-notes">{guide.notes}</p>}
        {guide.instructions && <p>{guide.instructions}</p>}
      </Modal>
    </>
  );
}
