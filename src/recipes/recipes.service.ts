import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/types/jwt-payload';

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

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe not found`);
    }
    return recipe;
  }

  async update(
    user: JwtPayload,
    id: string,
    updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    const existingRecipe = await this.recipeRepository.findOne({
      where: { id },
    });

    if (!existingRecipe) {
      console.log(`Recipe with ID ${id} not found`);
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    if (user.role !== 'superadmin') {
      throw new UnauthorizedException('Only superusers can update recipes');
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

  async remove(id: string): Promise<void> {
    const existingRecipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!existingRecipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    await this.recipeRepository.remove(existingRecipe);
  }
}
