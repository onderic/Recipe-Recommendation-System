import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'recipies' })
export class Recipe {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'Title' })
  title: string;

  @Column({ name: 'Ingredients' })
  ingredients: string;

  @Column({ name: 'Instructions' })
  instructions: string;

  @Column({ name: 'Image_Name' })
  imageName: string;

  @Column({ name: 'createdBy', type: 'string', nullable: false }) // Set the type as string
  createdBy: string; // Type createdBy as string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id' }) // Use 'id' as the referencedColumnName
  creator: User;
}
