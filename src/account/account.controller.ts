import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountResponseDto } from './dto/account-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Account')
@Controller('api/account')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Création d\'un compte utilisateur' })
    @ApiResponse({ status: 201, description: 'Création avec succès de l\'utilisateur', type: AccountResponseDto })
    @ApiResponse({ status: 401, description: 'Il est nécessaire d\'être authentifié' })
    @ApiResponse({ status: 403, description: 'Il est nécessaire de disposer d\'un compte admin pour créer un compte' })
    @ApiResponse({ status: 422, description: 'Paramètres de connection invalide' })
    async createAccount(
        @Body() dto: CreateAccountDto,
        @Request() req: { user: { userId: string; roles: string[] } },
    ): Promise<AccountResponseDto> {
        return this.accountService.createAccount(dto, req.user);
    }

    @Get(':uid')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Récupération d\'un compte utilisateur' })
    @ApiResponse({ status: 200, description: 'Récupération avec succès de l\'utilisateur', type: AccountResponseDto })
    @ApiResponse({ status: 401, description: 'Il est nécessaire d\'être authentifié' })
    @ApiResponse({ status: 403, description: 'Il est nécessaire d\'être admin ou d\'être le propriétaire du compte' })
    @ApiResponse({ status: 404, description: 'Aucun utilisateur trouvé avec l\'UID donné' })
    async getAccount(
        @Param('uid') uid: string,
        @Request() req: { user: { userId: string; roles: string[] } },
    ): Promise<AccountResponseDto> {
        return this.accountService.findByUidOrMe(uid, req.user);
    }

    @Put(':uid')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Modification d\'un compte utilisateur' })
    @ApiResponse({ status: 201, description: 'Modification avec succès de l\'utilisateur', type: AccountResponseDto })
    @ApiResponse({ status: 401, description: 'Il est nécessaire d\'être authentifié' })
    @ApiResponse({ status: 403, description: 'Il est nécessaire d\'être admin ou d\'être le propriétaire du compte' })
    @ApiResponse({ status: 422, description: 'Paramètres de connection invalide' })
    async updateAccount(
        @Param('uid') uid: string,
        @Body() dto: UpdateAccountDto,
        @Request() req: { user: { userId: string; roles: string[] } },
    ): Promise<AccountResponseDto> {
        return this.accountService.updateAccount(uid, dto, req.user);
    }
}
