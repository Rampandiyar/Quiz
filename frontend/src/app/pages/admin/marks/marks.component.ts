import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface MarksDetail {
  name: string;
  regno: string;
  rollno: string;
  department: string;
  year: string;
  marks: number;
}

@Component({
  selector: 'app-marks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.css']
})
export default class MarksComponent implements OnInit {
  marksDetails: MarksDetail[] = []; // Initialize an empty array to hold marks details
  private readonly EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchMarks();
  }

  fetchMarks() {
    this.adminService.getMarksDetails().subscribe(
      (data: { marks: MarksDetail[] }) => { // Adjust the type of the response
        this.marksDetails = data.marks.map((detail) => ({ // Access the marks array directly
          name: detail.name || 'N/A',
          regno: detail.regno || 'N/A',
          rollno: detail.rollno || 'N/A',
          department: detail.department || 'N/A',
          year: detail.year || 'N/A',
          marks: detail.marks || 0,
        }));
      },
      (error) => {
        console.error('Error fetching marks:', error);
      }
    );
  }

  downloadPDF() {
    const data = document.querySelector('.container'); // Select the container of the table
    html2canvas(data as HTMLElement).then((canvas) => {//+
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('marks-details.pdf');
    });
  }

  downloadExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.marksDetails);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marks Details');

    // Save to file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: this.EXCEL_TYPE });
    const fileName = 'marks-details.xlsx';
    saveAs(data, fileName);
  }
}
