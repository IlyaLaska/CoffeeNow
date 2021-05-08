import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRoleAndUser1620490211340 implements MigrationInterface {
    name = 'AddRoleAndUser1620490211340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL, "name" character varying(256) NOT NULL, "initialEmail" character varying(256), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "key" character varying NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_resources_role" ("userId" uuid NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_8bac85eda79a984348fa4678845" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cc4323a03921e3b49137f9d7e8" ON "user_resources_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e0d1acdb36f020cb4be2e021bb" ON "user_resources_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "user_resources_role" ADD CONSTRAINT "FK_cc4323a03921e3b49137f9d7e8b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_resources_role" ADD CONSTRAINT "FK_e0d1acdb36f020cb4be2e021bb1" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_resources_role" DROP CONSTRAINT "FK_e0d1acdb36f020cb4be2e021bb1"`);
        await queryRunner.query(`ALTER TABLE "user_resources_role" DROP CONSTRAINT "FK_cc4323a03921e3b49137f9d7e8b"`);
        await queryRunner.query(`DROP INDEX "IDX_e0d1acdb36f020cb4be2e021bb"`);
        await queryRunner.query(`DROP INDEX "IDX_cc4323a03921e3b49137f9d7e8"`);
        await queryRunner.query(`DROP TABLE "user_resources_role"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
