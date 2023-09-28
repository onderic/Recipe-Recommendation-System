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

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
