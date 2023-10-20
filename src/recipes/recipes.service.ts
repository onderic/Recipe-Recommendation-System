import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const createdRecipe = this.recipeRepository.create(createRecipeDto);
    return this.recipeRepository.save(createdRecipe);
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ recipes: Recipe[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const [recipes, total] = await this.recipeRepository.findAndCount({
      skip,
      take: pageSize,
    });

    return { recipes, total };
  }

  async findOne(recipe_id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { recipe_id },
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe not found`);
    }
    return recipe;
  }

  async update(
    recipe_id: number,
    updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    const existingRecipe = await this.recipeRepository.findOne({
      where: { recipe_id },
    });
    if (!existingRecipe) {
      throw new NotFoundException(`Recipe with ID ${recipe_id} not found`);
    }

    if (updateRecipeDto.title) {
      existingRecipe.title = updateRecipeDto.title;
    }
    if (updateRecipeDto.ingredients) {
      existingRecipe.ingredients = updateRecipeDto.ingredients;
    }
    if (updateRecipeDto.instructions) {
      existingRecipe.instructions = updateRecipeDto.instructions;
    }
    if (updateRecipeDto.imageName) {
      existingRecipe.imageName = updateRecipeDto.imageName;
    }
    if (updateRecipeDto.cleanedIngredients) {
      existingRecipe.cleanedIngredients = updateRecipeDto.cleanedIngredients;
    }

    const updatedRecipe = await this.recipeRepository.save(existingRecipe);
    return updatedRecipe;
  }

  async remove(recipe_id: number): Promise<void> {
    const existingRecipe = await this.recipeRepository.findOne({
      where: { recipe_id },
    });
    if (!existingRecipe) {
      throw new NotFoundException(`Recipe with ID ${recipe_id} not found`);
    }

    await this.recipeRepository.remove(existingRecipe);
  }
}
