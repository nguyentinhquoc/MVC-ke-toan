import { Body, Controller, Get, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { InputExcelData } from 'src/modules/ve-may-bay-so/type/type';
import * as XLSX from 'xlsx';
import { VeMayBaySoService } from './ve-may-bay-so.service';
interface UploadedFileType {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}


@Controller('ve-may-bay-so')
export class VeMayBaySoController {
  constructor(private readonly veMayBaySoService: VeMayBaySoService) {}

  
    @Get()
    @Render('index')
    renderHome() {
      return {
        title: 'Công cụ xem file Excel',
        message: 'Upload file Excel của bạn để xem dữ liệu',
      };
    }
  
    @Post()
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
        const NgayHoaDon = new Date().toLocaleDateString('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});
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

  NgayHoaDon: NgayHoaDon,

  MaKhachHang: null,

  TenKhachHang: data.TenKhachHang || null,

  TenNguoiMua: null,

  MaSoThue:
    data.MSTKhachLeCaNhan?.length === 12
      ? data.MSTKhachLeCaNhan
      : null,

  MaDVQHNSach: null,

  DiaChiKhachHang:
    data.DiaChiKhachLe || 'Người mua không cung cấp thông tin',

  DienThoaiKhachHang: null,

  CCCDan:
    data.CCCDKhachle?.length === 12
      ? data.CCCDKhachle
      : null,

  SoHoChieu: null,

  SoTaiKhoan: null,

  NganHang: null,

  EmailKhachHang: null,

  HinhThucTT: 'Tiền mặt hoặc chuyển khoản',

  SoBangKe: null,

  NgayBangKe: null,

  MaSanPham: null,

  SanPham: `${data.SoVe} ${data.HanhTrinh}`,

  DonViTinh: 'vé',

  RemarkSP: null,

  ExtraSP: null,

  Extra1SP: null,

  Extra2SP: null,

  SoLuong: '1',

  DonGia: Math.round(DonGia).toString(),

  TyLeChietKhau: null,

  SoTienChietKhau: null,

  ThanhTien: Math.round(DonGia).toString(),

  TienBan: Math.round(DonGia).toString(),

  ThueSuat: (data.ThueGTGT == 0 ? 0 : 8).toString(),

  TienThueSanPham: null,

  TienThue: Math.round(
    data.ThueGTGT == 0 ? 0 : DonGia * 0.08
  ).toString(),

  TongSoTienChietKhau: null,

  TongCong: Math.round(
    DonGia +
      (data.ThueGTGT == 0 ? 0 : DonGia * 0.08)
  ).toString(),

  TinhChatHangHoa: '0',

  DonViTienTe: 'VND',

  TyGia: '1',

  Fkey: null,

  Extra1: null,
  Extra2: null,
  Extra3: null,
  Extra4: null,
  Extra5: null,
  Extra6: null,
  Extra7: null,
  Extra8: null,
  Extra9: null,
  Extra10: null,
  Extra11: null,
  Extra12: null,
  wavebear: null,
  wavebear_01: null,
  mau_01: null,
};

        });
        // Lọc ra dữ liệu cho khách hàng Thịnh Vượng
        const excelDataTvOld = jsonData.filter((data: InputExcelData) => data.MaKhachHang=='PROTE');
        const excelDataTv = excelDataTvOld.map((data: InputExcelData, index: number) => {
          const DonGia = data.ThueGTGT==0 ? (data.TongGiaNhap + data.TienLai * tyGiaThayDoi) : ((data.TongGiaNhap / 1.08) + (data.TienLai * tyGiaThayDoi))
          const TienThue = Math.round(data.ThueGTGT == 0 ? (DonGia * 0) : (DonGia * 0.08));
          
          return {
            STT: 1,
            NgayHoaDon: NgayHoaDon,
            MaKhachHang: null,
            TenKhachHang: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN CÔNG NGHỆ VÀ DU LỊCH THỊNH VƯỢNG',
            TenNguoiMua: null,
            MaSoThue: '0110055731',
            MaDVQHNSach: null,
            DiaChiKhachHang:
              'Số 18 Hẻm 481/69/135 Ngọc Lâm, Phường Bồ Đề, TP Hà Nội, Việt Nam',
            DienThoaiKhachHang: null,
            CCCDan: null,
            SoHoChieu: null,
            SoTaiKhoan: null,
            NganHang: null,
            EmailKhachHang: null,
            HinhThucTT: 'Tiền mặt hoặc chuyển khoản',
            SoBangKe: null,
            NgayBangKe: null,
            MaSanPham: null,
            SanPham: `${data.SoVe} ${data.HanhTrinh}`,
            DonViTinh: 'Vé',
            RemarkSP: null,
            ExtraSP: null,
            Extra1SP: null,
            Extra2SP: null,
            SoLuong: 1,
            DonGia: Math.round(DonGia),
            TyLeChietKhau: null,
            SoTienChietKhau: null,
            ThanhTien: Math.round(DonGia),
            TienBan: Math.round(DonGia),
            ThueSuat: Math.round(data.ThueGTGT == 0 ? 0 : 8),
            TienThueSanPham: null,
            TienThue: TienThue,
            TongSoTienChietKhau: null,
            TongCong: Math.round(DonGia + TienThue),
            TinhChatHangHoa: 0,
            DonViTienTe: 'VND',
            TyGia: 1,
            Fkey: null,
            Extra1: null,
            Extra2: null,
            Extra3: null,
            Extra4: null,
            Extra5: null,
            Extra6: null,
            Extra7: null,
            Extra8: null,
            Extra9: null,
            Extra10: null,
            Extra11: null,
            Extra12: null,
            wavebear: null,
            wavebear_01: null,
            mau_01: null,
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
  

}
