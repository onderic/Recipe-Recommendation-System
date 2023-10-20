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
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity'; // Import the correct entity

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

  @Get(':recipe_id')
  async findOne(
    @Param('recipe_id', ParseIntPipe) recipe_id: number,
  ): Promise<Recipe> {
    return this.recipesService.findOne(recipe_id);
  }

  @Patch(':recipe_id')
  async update(
    @Param('recipe_id', ParseIntPipe) recipe_id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.update(recipe_id, updateRecipeDto);
  }

  @Delete(':recipe_id')
  async remove(
    @Param('recipe_id', ParseIntPipe) recipe_id: number,
  ): Promise<void> {
    return this.recipesService.remove(recipe_id);
  }
}
