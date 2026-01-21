import { Controller, Post, Body, Render, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('login')
  loginPage() {
    return {
      title: 'Đăng nhập hệ thống',
    };
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.login(username, password);
      
      // Set cookie với token (httpOnly để bảo mật)
      res.cookie('access_token', result.access_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });
      
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }
  
  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.redirect('/auth/login');
  }
}
