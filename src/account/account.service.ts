import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountRequest } from './dto/create-account.dto';
import { EditAccountRequest } from './dto/edit-account.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  create(createAccountRequest: CreateAccountRequest) {
    return this.prisma.user.create({
      data: {
        login: createAccountRequest.login,
        password: createAccountRequest.password,
        roles: createAccountRequest.roles || ['ROLE_USER'],
        status: createAccountRequest.status || 'open',
      },
    });
  }

  findOne(uid: string) {
    const id = parseInt(uid, 10);
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(uid: string, editAccountRequest: EditAccountRequest) {
    const id = parseInt(uid, 10);
    return this.prisma.user.update({
      where: { id },
      data: editAccountRequest,
    });
  }
}
