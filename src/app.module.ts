import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TasksModule,

    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: async () => ({
        type: 'postgres' as 'postgres',
        host: process.env.RDS_HOSTNAME,
        port: parseInt(process.env.RDS_PORT),
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DB_NAME,
        autoLoadEntities: true,
        synchronize: process.env.TYPEORM_SYNC === 'true'
      }),
    }),

  ],
})
export class AppModule {}

// https://jaketrent.com/post/configure-typeorm-inject-nestjs-config


// TypeOrmModule.forRoot(typeOrmConfig),

/*
TypeOrmModule.forRootAsync({
  imports: [],
  inject: [],
  useFactory: async () => ({
    type: 'postgres' as 'postgres',
    host: process.env.RDS_HOSTNAME,
    port: parseInt(process.env.RDS_PORT),
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
  }),
}),
*/

