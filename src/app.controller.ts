import {
  Controller,
  Get,
  Post,
  Render,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as XLSX from 'xlsx';
import { run } from 'node:test';
import type { InputExcelData } from 'src/type/type';

interface UploadedFileType {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'Công cụ xem file Excel',
      message: 'Upload file Excel của bạn để xem dữ liệu',
    };
  }

  @Post('upload-excel')
  @Render('index')
  @UseInterceptors(FileInterceptor('file'))
  uploadExcel(@UploadedFile() file: UploadedFileType) {
    const tiLeLai = 0.5;
    try {
      if (!file) {
        return {
          title: 'Công cụ xem file Excel',
          message: 'Vui lòng chọn một file',
          error: 'Không có file nào được tải lên',
        };
      }
      // Đọc file Excel
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      // Lấy sheet đầu tiên
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Chuyển đổi sang JSON với các cột rỗng vẫn có giá trị
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        defval: '', // Các ô trống sẽ có giá trị là chuỗi rỗng
        blankrows: true // Giữ cả các dòng trống
      });
      
      // Loại bỏ các cột __EMPTY
      const jsonData = rawData.map((row: any) => {
        const cleanRow: any = {};
        Object.keys(row).forEach(key => {
          if (!key.startsWith('__EMPTY')) {
            cleanRow[key] = row[key];
          }
        });
        return cleanRow;
      });
      
      const excelDataKlOld = jsonData.filter((data: InputExcelData) => data.MaKhachHang === 'KL');
      const excelDataKl = excelDataKlOld.map( (data: InputExcelData, index: number) => {
        const DonGia = data.ThueGTGT === 0 ? (data.TongThuKhach ) : (data.TongThuKhach / 1.08 )
        return {
          STT: index + 1,
          NgayHoaDon: data.NgayThang,
          TenKhachHang: data.TenKhachHang,
          MaSoThue:data.MSTKhachLeCaNhan && data.MSTKhachLeCaNhan.length === 12 ? data.MSTKhachLeCaNhan : '',
          DiaChiKhachHang: data.DiaChiKhachLe ? data.DiaChiKhachLe : 'Người mua không cung cấp thông tin',
          CCCD: data.CCCDKhachle && data.CCCDKhachle.length === 12 ? data.CCCDKhachle : '',
          EmailKhachHang: '',
          HinhThucTT:'Tiền mặt hoặc chuyển khoản',
          SanPham: `${data.SoVe} ${data.HanhTrinh}`,
          DonViTinh:'vé',
          SoLuong: 1,
          DonGia: Math.round(DonGia),
          ThanhTien: Math.round(DonGia),
          TienBan: Math.round(DonGia),
          ThueSuat: Math.round(data.ThueGTGT === 0 ? (DonGia * 0) : (DonGia * 0.08)),
          TongCong: Math.round(DonGia + (data.ThueGTGT === 0 ? (DonGia * 0) : (DonGia * 0.08))),
          TinhChatHangHoa: 0,
          DonViTienTe: 'VND'
        };
      }); 
      const excelDataTvOld =   jsonData.filter((data: InputExcelData) => data.MaKhachHang === 'PROTE');
      const excelDataTv = excelDataTvOld.map( (data: InputExcelData, index: number) => {
        const tyGiaThayDoi = 0.38;
          const DonGia = data.ThueGTGT === 0 ? (data.TongGiaNhap + data.TienLai * tyGiaThayDoi) : ((data.TongGiaNhap / 1.08) + (data.TienLai * tyGiaThayDoi) )
          const TienThue = Math.round(data.ThueGTGT === 0 ? (DonGia * 0) : (DonGia * 0.08));
        return {
         STT: index + 1,
         NgayHoaDon: data.NgayThang,
         MaKhachHang :null,
         TenKhachHang:'CÔNG TY CỔ PHẦN TẬP ĐOÀN CÔNG NGHỆ VÀ DU LỊCH THỊNH VƯỢNG',
         TenNguoiMua: null,
         MaSoThue: '0110055731',
         DiaChiKhachHang: 'Số 18 Hẻm 481/69/135 Ngọc Lâm, Phường Bồ Đề, TP Hà Nội, Việt Nam',
         HinhThucTT:'Tiền mặt hoặc chuyển khoản',
          SanPham: `${data.SoVe} ${data.HanhTrinh}`,
         DonViTinh:'Vé',
         SoLuong: 1,
         DonGia: Math.round(DonGia),
         ThanhTien: Math.round(DonGia),
         TienBan: Math.round(DonGia),
         ThueSuat: Math.round(data.ThueGTGT === 0 ? 0 : 8),
         TienThue: TienThue,
         TongCong: Math.round(DonGia + TienThue),
         TinhChatHangHoa: 0,
         DonViTienTe: 'VND'
        };
      }); 
      return {
        title: 'Công cụ xem file Excel',
        message: 'Dữ liệu đã được tải lên thành công!',
        excelData: jsonData,
        excelDataKl: excelDataKl,
        excelDataTv: excelDataTv,
        fileName: file.originalname,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Không thể đọc file Excel';
      return {
        title: 'Công cụ xem file Excel',
        message: 'Có lỗi xảy ra khi xử lý file',
        error: errorMessage,
      };
    }
  }

  @Get('about')
  @Render('about')
  getAbout() {
    return {
      title: 'Giới thiệu',
    };
  }
}
