import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { AccountModule } from './account/account.module';
import { TokenModule } from './token/token.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    PrismaModule,
    ArticlesModule,
    AccountModule,
    TokenModule,
    RefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
