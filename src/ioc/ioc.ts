import 'reflect-metadata';
import { inversify } from '~packages';
import { EdgeModule } from './ioc.edge.module';

const container = new inversify.Container();
container.load(EdgeModule);
export { container };
