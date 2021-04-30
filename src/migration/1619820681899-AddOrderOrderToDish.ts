import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOrderOrderToDish1619820681899 implements MigrationInterface {
    name = 'AddOrderOrderToDish1619820681899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "code" character varying(16) NOT NULL, "notes" character varying(4096), "status" character varying(32) NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_to_dish" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "dishId" integer NOT NULL, "amount" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_cb2c2e81514e1acca6b56c44a40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_to_dish" ADD CONSTRAINT "FK_fa33b1a37da03daac166ae637d7" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_to_dish" ADD CONSTRAINT "FK_e8289b20a2bb19583f2a1310a7f" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_to_dish" DROP CONSTRAINT "FK_e8289b20a2bb19583f2a1310a7f"`);
        await queryRunner.query(`ALTER TABLE "order_to_dish" DROP CONSTRAINT "FK_fa33b1a37da03daac166ae637d7"`);
        await queryRunner.query(`DROP TABLE "order_to_dish"`);
        await queryRunner.query(`DROP TABLE "order"`);
    }

}
