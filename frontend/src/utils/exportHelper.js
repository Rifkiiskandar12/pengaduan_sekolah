import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportPDF = (data) => {
  const doc = new jsPDF();
  doc.text("Laporan Pengaduan Sekolah", 14, 16);
  autoTable(doc, {
    startY: 22,
    head: [["Judul", "Kategori", "Status", "Pelapor", "Tanggal"]],
    body: data.map((item) => [
      item.judul,
      item.kategori,
      item.status,
      item.pelapor?.name || "-",
      new Date(item.createdAt).toLocaleDateString("id-ID"),
    ]),
  });
  doc.save("laporan-pengaduan.pdf");
};

export const exportExcel = (data) => {
  const rows = data.map((item) => ({
    Judul: item.judul,
    Kategori: item.kategori,
    Status: item.status,
    Pelapor: item.pelapor?.name || "-",
    Tanggal: new Date(item.createdAt).toLocaleDateString("id-ID"),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pengaduan");
  XLSX.writeFile(wb, "laporan-pengaduan.xlsx");
};