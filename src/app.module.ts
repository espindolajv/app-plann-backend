import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ListModule } from './modules/list/list.module';

@Module({
  imports: [UserModule, AuthModule, ListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
