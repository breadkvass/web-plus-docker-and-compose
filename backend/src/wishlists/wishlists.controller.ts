import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  NotFoundException,
  ForbiddenException,
  UseGuards
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createWishlistDto: CreateWishlistDto) {
    const wishlist = await this.wishlistsService.create(
      req.user.userId,
      createWishlistDto,
    );

    return wishlist;
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(+id);

    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }

    return wishlist;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.wishlistsService.findOne(+id);

    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }

    if (wishlist.owner.id !== req.user.userId) {
      throw new ForbiddenException('У Вас нет доступа для редактирования этого списка желаний');
    }

    return this.wishlistsService.update(+id, updateWishlistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(+id);

    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }

    if (wishlist.owner.id !== req.user.userId) {
      throw new ForbiddenException('У Вас нет доступа для удаления этого списка желаний');
    }

    return this.wishlistsService.remove(+id);
  }
}
