import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VeMayBaySoModule } from 'src/modules/ve-may-bay-so/ve-may-bay-so.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'ke-toan',
      entities: [User],
      synchronize: true, // Tự động tạo bảng (chỉ dùng dev)
    }),
    AuthModule,
    VeMayBaySoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
