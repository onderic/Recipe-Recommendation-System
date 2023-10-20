import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .where('user.refreshToken = :refreshToken', { refreshToken })
      .getOne();
  }
}
