import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import type { InputExcelData } from 'src/modules/ve-may-bay-so/type/type';
import * as XLSX from 'xlsx';
import { AppService } from './app.service';

interface UploadedFileType {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Controller()
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) { }

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
  uploadExcel(@UploadedFile() file: UploadedFileType, @Body('tyGiaThayDoi') tyGiaThayDoi: number) {
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
      const jsonDataGoc = rawData.map((row: any) => {
        const cleanRow: any = {};
        Object.keys(row).forEach(key => {
          if (!key.startsWith('__EMPTY')) {
            cleanRow[key] = row[key];
          }
        });
        return cleanRow;
      });
const jsonData = jsonDataGoc.filter((data: InputExcelData) => data.NguonNCC !== 'TV');
      const excelDataKlOld = jsonData.filter((data: InputExcelData) => data.MaKhachHang=='KL');
      const excelDataKl = excelDataKlOld.map((data: InputExcelData, index: number) => {
        const DonGia = data.ThueGTGT==0 ? (data.TongThuKhach) : (data.TongThuKhach / 1.08)
        return {
          STT: index + 1,
          NgayHoaDon: data.NgayThang,
          TenKhachHang: data.TenKhachHang,
          MaSoThue: data.MSTKhachLeCaNhan && data.MSTKhachLeCaNhan.length==12 ? data.MSTKhachLeCaNhan : '',
          DiaChiKhachHang: data.DiaChiKhachLe ? data.DiaChiKhachLe : 'Người mua không cung cấp thông tin',
          CCCD: data.CCCDKhachle && data.CCCDKhachle.length==12 ? data.CCCDKhachle : '',
          EmailKhachHang: '',
          HinhThucTT: 'Tiền mặt hoặc chuyển khoản',
          SanPham: `${data.SoVe} ${data.HanhTrinh}`,
          DonViTinh: 'vé',
          SoLuong: 1,
          DonGia: Math.round(DonGia),
          ThanhTien: Math.round(DonGia),
          TienBan: Math.round(DonGia),
          ThueSuat: Math.round(data.ThueGTGT==0 ? (DonGia * 0) : (DonGia * 0.08)),
          TongCong: Math.round(DonGia + (data.ThueGTGT==0 ? (DonGia * 0) : (DonGia * 0.08))),
          TinhChatHangHoa: 0,
          DonViTienTe: 'VND'
        };
      });
      // Lọc ra dữ liệu cho khách hàng Thịnh Vượng
      const excelDataTvOld = jsonData.filter((data: InputExcelData) => data.MaKhachHang=='PROTE');
      const excelDataTv = excelDataTvOld.map((data: InputExcelData, index: number) => {
        const DonGia = data.ThueGTGT==0 ? (data.TongGiaNhap + data.TienLai * tyGiaThayDoi) : ((data.TongGiaNhap / 1.08) + (data.TienLai * tyGiaThayDoi))
        const TienThue = Math.round(data.ThueGTGT == 0 ? (DonGia * 0) : (DonGia * 0.08));
        return {
          STT: 1,
          NgayHoaDon: data.NgayThang,
          MaKhachHang: null,
          TenKhachHang: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN CÔNG NGHỆ VÀ DU LỊCH THỊNH VƯỢNG',
          TenNguoiMua: null,
          MaSoThue: '0110055731',
          DiaChiKhachHang: 'Số 18 Hẻm 481/69/135 Ngọc Lâm, Phường Bồ Đề, TP Hà Nội, Việt Nam',
          HinhThucTT: 'Tiền mặt hoặc chuyển khoản',
          SanPham: `${data.SoVe} ${data.HanhTrinh}`,
          DonViTinh: 'Vé',
          SoLuong: 1,
          DonGia: Math.round(DonGia),
          ThanhTien: Math.round(DonGia),
          TienBan: Math.round(DonGia),
          ThueSuat: Math.round(data.ThueGTGT == 0 ? 0 : 8),
          TienThue: TienThue,
          TongCong: Math.round(DonGia + TienThue),
          TinhChatHangHoa: 0,
          DonViTienTe: 'VND'
        };
      });
     const sortedByTienThueDesc = [...excelDataTv].sort(
  (a, b) => b.TienThue - a.TienThue
);

// ================== 4. Chia group ==================

const tvThueLonHon = sortedByTienThueDesc.filter(x => x.TienThue > 0);
const tvThueBang = sortedByTienThueDesc.filter(x => x.TienThue == 0);
const tvThueNhoHon = sortedByTienThueDesc.filter(x => x.TienThue < 0);

// ================== 5. Field header cần clear cho dòng sau ==================

const headerFields = [
  'NgayHoaDon',
  'MaKhachHang',
  'TenKhachHang',
  'TenNguoiMua',
  'MaSoThue',
  'DiaChiKhachHang',
  'HinhThucTT'
];

// ================== 6. Function format group ==================

function applyGroupFormat(dataList, sttValue) {
  return dataList.map((item, index) => {
    if (index == 0) {
      return {
        ...item,
        STT: sttValue
      };
    }

    const clearedFields = {};
    headerFields.forEach(key => {
      clearedFields[key] = null;
    });

    return {
      ...item,
      STT: null,
      ...clearedFields
    };
  });
}

// ================== 7. Áp dụng STT cho từng group ==================

const tvThueLonHonWithStt = applyGroupFormat(tvThueLonHon, 1);
const tvThueBangWithStt = applyGroupFormat(tvThueBang, 2);
const tvThueNhoHonWithStt = applyGroupFormat(tvThueNhoHon, 3);

// ================== 8. Gộp dữ liệu cuối ==================

const excelDataTvOk = [
  ...tvThueLonHonWithStt,
  ...tvThueBangWithStt,
  ...tvThueNhoHonWithStt
];

      return {
        title: 'Công cụ xem file Excel',
        message: 'Dữ liệu đã được tải lên thành công!',
        excelData: jsonData,
        excelDataKl: excelDataKl,
        excelDataTv: excelDataTvOk,
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
