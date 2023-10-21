import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'recipies' })
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'Title' })
  title: string;

  @Column({ name: 'Ingredients' })
  ingredients: string;

  @Column({ name: 'Instructions' })
  instructions: string;

  @Column({ name: 'Image_Name' })
  imageName: string;

  @Column({ name: 'Cleaned_Ingredients' })
  cleanedIngredients: string;
}
