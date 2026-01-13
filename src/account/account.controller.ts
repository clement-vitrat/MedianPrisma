import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAccountRequest } from './dto/create-account.dto';
import { EditAccountRequest } from './dto/edit-account.dto';
import { UserEntity } from './entities/user.entity';

@Controller('account')
@ApiTags('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createAccountRequest: CreateAccountRequest) {
    return this.accountService.create(createAccountRequest);
  }

  @Get(':uid')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('uid') uid: string) {
    return this.accountService.findOne(uid);
  }

  @Put(':uid')
  @ApiOkResponse({ type: UserEntity })
  update(@Param('uid') uid: string, @Body() editAccountRequest: EditAccountRequest) {
    return this.accountService.update(uid, editAccountRequest);
  }
}
