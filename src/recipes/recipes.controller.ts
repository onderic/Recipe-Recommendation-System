import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtPayload } from '../types/jwt-payload';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<{ recipes: Recipe[]; total: number }> {
    return this.recipesService.findAll(page, pageSize);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<Recipe> {
    return this.recipesService.findOne(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<Recipe> {
    return this.recipesService.update(user, id, updateRecipeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string): Promise<void> {
    return this.recipesService.remove(id);
  }
}
