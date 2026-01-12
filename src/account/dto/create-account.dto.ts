import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
    @ApiProperty({ example: 'john.doe', description: 'Login de l\'utilisateur' })
    login: string;

    @ApiProperty({ example: 'password123', description: 'Mot de passe' })
    password: string;

    @ApiProperty({
        example: ['ROLE_USER'],
        description: 'Roles: ROLE_ADMIN pour administrateur, ROLE_USER pour utilisateur',
        type: [String]
    })
    roles: string[];

    @ApiProperty({
        example: 'open',
        description: 'Statut: "open" pour compte ouvert, "closed" pour compte fermé',
        required: false,
        default: 'open'
    })
    status?: string;
}
