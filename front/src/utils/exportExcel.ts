import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export function exportExcel(name, header, row, title) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(name);

  const titleStyle = {
    font: { bold: true, size: 14 },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4C8BF5' },
    },
  };

  const headerStyle = {
    font: { bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472c4' },
    },
    textTransform: 'uppercase',
  };

  worksheet.columns = header;

  worksheet.getRow(1).eachCell((cell: any) => {
    cell.style = titleStyle;
  });

  worksheet.getRow(1).height = 35;

  const cellStyle = {
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' },
    },
    alignment: { horizontal: 'right' },
  };

  worksheet.mergeCells(1, 1, 1, header.length);
  worksheet.getCell('A1').value = title;

  const headers = header.map((item) => item.header?.toUpperCase());

  worksheet.addRow(headers);

  worksheet.getRow(2).eachCell((cell: any) => {
    cell.style = headerStyle;
  });

  worksheet.getRow(2).height = 25;

  row.map((item) =>
    worksheet.addRow(item).eachCell((cell: any) => {
      cell.style = cellStyle;
    }),
  );

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${name}.xlsx`);
  });
}
