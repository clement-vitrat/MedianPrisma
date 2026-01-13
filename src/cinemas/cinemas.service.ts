import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemasService {
  constructor(private prisma: PrismaService) {}

  async create(createCinemaDto: CreateCinemaDto) {
    return this.prisma.cinema.create({
      data: createCinemaDto,
    });
  }

  async findAll() {
    return this.prisma.cinema.findMany();
  }

  async findOne(id: number) {
    return this.prisma.cinema.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCinemaDto: UpdateCinemaDto) {
    return this.prisma.cinema.update({
      where: { id },
      data: updateCinemaDto,
    });
  }

  async remove(id: number) {
    return this.prisma.cinema.delete({
      where: { id },
    });
  }
}
