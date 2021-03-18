import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RDS_HOSTNAME,
  port: parseInt(process.env.RDS_PORT),
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  autoLoadEntities: true,
  synchronize: process.env.TYPEORM_SYNC === 'true'
}
