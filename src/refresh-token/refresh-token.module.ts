import { Module } from '@nestjs/common';
import { RefreshTokenController } from './refresh-token.controller';
import { TokenModule } from '../token/token.module';

@Module({
    imports: [TokenModule],
    controllers: [RefreshTokenController],
})
export class RefreshTokenModule { }
