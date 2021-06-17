import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDishAndMenu1619734458994 implements MigrationInterface {
  name = 'AddDishAndMenu1619734458994';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(
      `CREATE TABLE "menu" ("id" SERIAL NOT NULL, "name" character varying(128) NOT NULL, "description" character varying(4096), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dish" ("id" SERIAL NOT NULL, "name" character varying(128) NOT NULL, "description" character varying(4096), "price" integer NOT NULL DEFAULT '0', "category" character varying(128) NOT NULL, "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_59ac7b35af39b231276bfc4c00c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "menu_dishes_dish" ("menuId" integer NOT NULL, "dishId" integer NOT NULL, CONSTRAINT "PK_37d2d2b03230d04ea2685345b78" PRIMARY KEY ("menuId", "dishId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_5bc30fb3a1e30b5d45d0ae6063" ON "menu_dishes_dish" ("menuId") `);
    await queryRunner.query(`CREATE INDEX "IDX_2c5ee95c71a582281c749b77d8" ON "menu_dishes_dish" ("dishId") `);
    await queryRunner.query(
      `ALTER TABLE "menu_dishes_dish" ADD CONSTRAINT "FK_5bc30fb3a1e30b5d45d0ae60635" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_dishes_dish" ADD CONSTRAINT "FK_2c5ee95c71a582281c749b77d81" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "query-result-cache"`);
    await queryRunner.query(`ALTER TABLE "menu_dishes_dish" DROP CONSTRAINT "FK_2c5ee95c71a582281c749b77d81"`);
    await queryRunner.query(`ALTER TABLE "menu_dishes_dish" DROP CONSTRAINT "FK_5bc30fb3a1e30b5d45d0ae60635"`);
    await queryRunner.query(`DROP INDEX "IDX_2c5ee95c71a582281c749b77d8"`);
    await queryRunner.query(`DROP INDEX "IDX_5bc30fb3a1e30b5d45d0ae6063"`);
    await queryRunner.query(`DROP TABLE "menu_dishes_dish"`);
    await queryRunner.query(`DROP TABLE "dish"`);
    await queryRunner.query(`DROP TABLE "menu"`);
  }
}
