import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one ingredient is required' })
  ingredients: IngredientDto[];

  @IsString()
  @IsNotEmpty()
  instructions: string;

  imageUrl?: string;
}

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;
}
