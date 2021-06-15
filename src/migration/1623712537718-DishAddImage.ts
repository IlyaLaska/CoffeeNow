import {MigrationInterface, QueryRunner} from "typeorm";

export class DishAddImage1623712537718 implements MigrationInterface {
    name = 'DishAddImage1623712537718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish" ADD "imageId" uuid`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "UQ_204187109df7bf47a58599a6ff0" UNIQUE ("imageId")`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "FK_204187109df7bf47a58599a6ff0" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "FK_204187109df7bf47a58599a6ff0"`);
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "UQ_204187109df7bf47a58599a6ff0"`);
        await queryRunner.query(`ALTER TABLE "dish" DROP COLUMN "imageId"`);
    }

}
