import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const getExcelBorder = (cssWidth: string, cssStyle: string) => {
  if (cssStyle === 'none' || cssWidth === '0px') return undefined;

  const px = parseFloat(cssWidth);
  let style: 'thin' | 'medium' | 'thick' = 'thin';

  if (px <= 1) {
    style = 'thin';
  } else if (px <= 2) {
    style = 'medium';
  } else {
    style = 'thick';
  }

  return {
    style,
    color: { argb: 'FF000000' },
  };
};

interface Month {
  key: number;
  year: number;
  month: number;
}

interface Week {
  key: number;
  year: number;
  month: number;
  offset: number;
}

@Component({
  selector: 'app-task-gantt',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-gantt.html',
  styleUrl: './task-gantt.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskGantt {
  private nfb = inject(NonNullableFormBuilder);

  color = input<'black' | 'red' | 'orange'>('black');
  event = output<'add-task' | 'remove-task'>();

  form = this.createForm();
  months: Array<Month> = [];
  weeks: Array<Week> = [];

  get tasks() {
    return this.form.controls.tasks;
  }

  constructor() {
    this.form.controls.start.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.updateMonths());
    this.form.controls.end.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.updateMonths());
    this.updateMonths();
  }

  createForm() {
    const date = new Date();
    return this.nfb.group({
      start: this.nfb.group({
        year: [date.getFullYear(), [Validators.required]],
        month: [date.getMonth(), [Validators.required]],
      }),
      end: this.nfb.group({
        year: [date.getFullYear() + 1, [Validators.required]],
        month: [date.getMonth(), [Validators.required]],
      }),
      tasks: this.nfb.array([this.createTask()]),
    });
  }

  createTask() {
    return this.nfb.group({
      name: ['Nueva tarea', Validators.required],
      weeks: [4, [Validators.required]],
      start: this.firstWeek(),
    });
  }

  add(): void {
    this.form.controls.tasks.push(this.createTask());
    this.event.emit('add-task');
  }

  remove(position: number): void {
    this.form.controls.tasks.removeAt(position);
    this.event.emit('remove-task');
  }

  updateMonths(): void {
    this.months = [];
    this.weeks = [];
    const value = this.form.getRawValue();
    let current = { ...value.start };
    let safeguard = 0;

    while (this.monthKey(current) <= this.monthKey(value.end)) {
      safeguard++;
      const month = { ...current, key: this.monthKey(current) };
      this.months.push(month);
      for (let offset = 0; offset <= 3; offset++) {
        this.weeks.push({
          ...month,
          key: this.weekKey({ ...month, offset }),
          offset,
        });
      }
      current.month = current.month + 1;
      if (current.month >= 12) {
        current = { year: current.year + 1, month: 0 };
      }

      if (safeguard > 1000) {
        alert('Maximo de semanas excedido');
        this.months = [];
        this.weeks = [];
        break;
      }
    }
  }

  setStart(index: number, week: Week): void {
    this.tasks.controls.at(index)?.patchValue({ start: week });
  }

  isSelected(index: number, week: Week): boolean {
    const value = this.tasks.controls.at(index)?.getRawValue();
    if (!value) return false;
    const reference = this.weekKey(week);
    const endReference = this.weekKey(this.addWeeks(value.start, value.weeks));
    return value.start.key <= reference && reference < endReference;
  }

  toExcel2(): void {
    const table = document.getElementById('LaTabla') as HTMLTableElement;
    if (!table) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Hoja1');
    const startRowOffset = 1;
    const startColOffset = 1;
    const cellMap = new Map<string, boolean>();
    const getAddress = (row: number, col: number) => `${row}-${col}`;

    const getNextFreeCol = (row: number, startCol: number): number => {
      let col = startCol;
      while (cellMap.get(getAddress(row, col))) {
        col++;
      }
      return col;
    };

    const tableRows = Array.from(table.rows);

    for (let rowIndex = 0; rowIndex < tableRows.length; rowIndex++) {
      const row = tableRows[rowIndex];
      let colIndex = 0;

      for (const cell of Array.from(row.cells)) {
        colIndex = getNextFreeCol(rowIndex, colIndex);
        const rowspan = cell.rowSpan || 1;
        const colspan = cell.colSpan || 1;
        const value = cell.textContent?.trim() || '';
        const excelCol = colIndex + 1 + startColOffset;
        const excelRowIndex = rowIndex + 1 + startRowOffset;
        const excelCell = sheet.getCell(excelRowIndex, excelCol);
        excelCell.value = value;

        for (let r = 0; r < rowspan; r++) {
          for (let c = 0; c < colspan; c++) {
            cellMap.set(getAddress(rowIndex + r, colIndex + c), true);
          }
        }

        if (rowspan > 1 || colspan > 1) {
          sheet.mergeCells(excelRowIndex, excelCol, excelRowIndex + rowspan - 1, excelCol + colspan - 1);
        }

        const style = getComputedStyle(cell);
        const border = {
          top: getExcelBorder(style.borderTopWidth, style.borderTopStyle),
          bottom: getExcelBorder(style.borderBottomWidth, style.borderBottomStyle),
          left: getExcelBorder(style.borderLeftWidth, style.borderLeftStyle),
          right: getExcelBorder(style.borderRightWidth, style.borderRightStyle),
        };

        excelCell.border = border;

        const bgColor = style.backgroundColor;
        const rgbaMatch = bgColor.match(/^rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([\d.]+))?\)$/);
        if (rgbaMatch) {
          const [, r, g, b, a] = rgbaMatch;
          const alpha = a !== undefined ? parseFloat(a) : 1;
          if (alpha > 0) {
            const hex = ((+r << 16) | (+g << 8) | +b).toString(16).padStart(6, '0').toUpperCase();
            excelCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: `FF${hex}` },
            };
          }
        }

        const isBold = cell.tagName === 'TH' || parseInt(style.fontWeight, 10) >= 700;
        if (isBold) {
          excelCell.font = { bold: true };
        }

        colIndex += colspan;
      }
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'tabla-exportada.xlsx');
    });
  }

  private monthKey({ year, month }: { year: number; month: number }): number {
    return year * 1000 + month * 10;
  }

  private weekKey({ year, month, offset }: { year: number; month: number; offset: number }): number {
    return this.monthKey({ year, month }) + offset;
  }

  private firstWeek(): Week {
    const date = new Date();
    const value = { year: date.getFullYear(), month: date.getMonth(), offset: 0 };
    return { ...value, key: this.weekKey(value) };
  }

  private addWeeks(week: Week, weeks: number): Week {
    let result = { ...week };
    const totalOffset = week.offset + weeks;
    const months = Math.floor(totalOffset / 4);
    if (months) {
      const date = new Date(result.year, result.month);
      date.setMonth(date.getMonth() + months);
      result.year = date.getFullYear();
      result.month = date.getMonth();
    }
    const offset = totalOffset % 4;
    result.offset = offset;
    return result;
  }
}
