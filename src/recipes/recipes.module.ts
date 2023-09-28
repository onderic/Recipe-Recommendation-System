import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeSchema } from './schemas/recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }]), // Import the Recipe model
    // Other modules you might need
  ],
  controllers: [RecipesController],
  providers: [RecipesService /* other providers if needed */],
})
export class RecipesModule {}
