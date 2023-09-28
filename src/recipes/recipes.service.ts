import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './schemas/recipe.schema';
import { Model } from 'mongoose';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const createdRecipe = new this.recipeModel(createRecipeDto);
    return createdRecipe.save();
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ recipes: Recipe[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const [recipes, total] = await Promise.all([
      this.recipeModel.find().skip(skip).limit(pageSize).exec(),
      this.recipeModel.countDocuments().exec(),
    ]);

    return { recipes, total };
  }

  async findOne(id: string): Promise<Recipe> {
    try {
      const recipe = await this.recipeModel.findById(id).exec();
      if (!recipe) {
        throw new NotFoundException(`Recipe not found`);
      }
      return recipe;
    } catch (error) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    try {
      const existingRecipe = await this.recipeModel.findById(id).exec();
      if (!existingRecipe) {
        throw new NotFoundException(`Recipe with ID ${id} not found`);
      }
      // Update the recipe fields with the values from updateRecipeDto
      if (updateRecipeDto.title) {
        existingRecipe.title = updateRecipeDto.title;
      }
      if (updateRecipeDto.description) {
        existingRecipe.description = updateRecipeDto.description;
      }
      if (updateRecipeDto.ingredients) {
        existingRecipe.ingredients = updateRecipeDto.ingredients;
      }
      if (updateRecipeDto.instructions) {
        existingRecipe.instructions = updateRecipeDto.instructions;
      }
      if (updateRecipeDto.imageUrl) {
        existingRecipe.imageUrl = updateRecipeDto.imageUrl;
      }

      const updatedRecipe = await existingRecipe.save();
      return updatedRecipe;
    } catch (error) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
