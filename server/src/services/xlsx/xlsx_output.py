from datetime import datetime
from typing import Any

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font
from openpyxl.worksheet.worksheet import Worksheet


class XlsxWriter:
    _counter: int = 0
    _wb: Workbook
    _worksheet: Worksheet

    TABLE_HEADER_CELL_ALIGNMENT = Alignment(horizontal="center", vertical="bottom")
    TABLE_HEADER_CELL_FONT = Font(bold=True, name="Times New Roman", size=14)

    COLUMN_TITLE_ALIGNMENT = Alignment(horizontal="center", vertical="center")
    COLUMN_TITLE_FONT = Font(bold=True, name="Times New Roman", size=12)

    def __init__(self, chairman: str = "Иванов И. И."):
        self._wb = Workbook()
        self._configure_worksheet()
        self._create_header(chairman, datetime.now())

    def _configure_worksheet(self):
        self._worksheet = self._wb.active
        self._worksheet.title = "Промышленные территории"

    def _create_header(self, chairman: str, date: datetime = datetime.now()):
        self._create_table_title(chairman, date)
        self._create_column_titles()

    def _create_table_title(self, chairman: str, date: datetime):
        self._set_table_header_part("A1:B3", "г. Москва")
        self._set_table_header_part(
            "C1:I3",
            f"Повестка совещания по проблемным объектам промышленного назначения под председательством {chairman}",
            alignment=Alignment(horizontal="center")
        )
        self._set_table_header_part("J1:K3", date)

    def _set_table_header_part(self, cells: str, value: Any, alignment: Alignment = None, font: Font = None):
        if isinstance(value, datetime):
            value = value.strftime("%d.%m.%Y %H:%M:%S")
        if alignment is None:
            alignment = self.TABLE_HEADER_CELL_ALIGNMENT
        if font is None:
            font = self.TABLE_HEADER_CELL_FONT

        cell = cells.split(':')[0]
        self._worksheet[cell] = value
        self._worksheet[cell].alignment = alignment
        self._worksheet[cell].font = font
        self._worksheet.merge_cells(cells)

    def _create_column_titles(self):
        self._set_column_header("A4", "№ п/п")
        self._set_column_header("B4", "Адрес (адресные ориентиры)")
        self._set_column_header("C4", "АО города Москвы")
        self._set_column_header("D4", "Кадастровый номер земельного участка")
        self._set_column_header("E4", "Промзона")
        self._set_column_header("F4", "№ протокола")
        self._set_column_header("G4", "Дата первичного рассмотрения")
        self._set_column_header("H4", "Кол-во рассмотрений")
        self._set_column_header("I4", "Прошлое поручение")
        self._set_column_header("J4", "Новое Поручение")
        self._set_column_header("K4", "Примечания")

    def _set_column_header(self, cell: str, value: Any):
        self._worksheet[cell].value = value
        self._worksheet[cell].alignment = self.COLUMN_TITLE_ALIGNMENT
        self._worksheet[cell].font = self.COLUMN_TITLE_FONT

    def generate_subpoenas(self, tasks):

        for task in tasks:
            self._counter += 1

    def _write_subpoena(self, task: dict):
        self._worksheet.cell(self._counter + 4, 1, self._counter)
        self._worksheet.cell(self._counter + 4, 2, task["address"])
        self._worksheet.cell(self._counter + 4, 3, task["address"])
        self._worksheet.cell(self._counter + 4, 4, task["address"])
        self._worksheet.cell(self._counter + 4, 5, task["address"])

    def save(self, path: str):
        self._wb.save(path)


if __name__ == "__main__":
    XlsxWriter().save("a.xlsx")
