import {MigrationInterface, QueryRunner} from "typeorm";

export class OrderAddDatesDishAndOrderChangePriceType1620592152123 implements MigrationInterface {
    name = 'OrderAddDatesDishAndOrderChangePriceType1620592152123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD "version" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "price" numeric(8,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "dish" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "dish" ADD "price" numeric(8,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "dish" ADD "price" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updateDate"`);
    }

}
