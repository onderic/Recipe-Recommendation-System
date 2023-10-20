import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe]), // Import the Recipe model
    // Other modules you might need
  ],
  controllers: [RecipesController],
  providers: [RecipesService /* other providers if needed */],
})
export class RecipesModule {}
