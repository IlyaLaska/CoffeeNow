import {MigrationInterface, QueryRunner} from "typeorm";

export class AddImageAndScale1623637656150 implements MigrationInterface {
    name = 'AddImageAndScale1623637656150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL, "originalName" character varying(512) NOT NULL DEFAULT '', "bucket" character varying(128) NOT NULL, "key" character varying(512) NOT NULL, "location" character varying(512) NOT NULL, "scales" text NOT NULL DEFAULT '', "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "deleteDate" TIMESTAMP, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scale" ("id" SERIAL NOT NULL, "scale" integer NOT NULL, CONSTRAINT "UQ_d891169ddc472d87cb5974f71ed" UNIQUE ("scale"), CONSTRAINT "PK_e93222b654623ca54e6c4a4445d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "scale"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
