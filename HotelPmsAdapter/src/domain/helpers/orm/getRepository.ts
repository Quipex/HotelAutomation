import { Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import appDataSource from '~/config/dataSource';

const getRepository = <Entity>(target: EntityTarget<Entity>): Repository<Entity> => appDataSource.getRepository(target);

export { getRepository };
