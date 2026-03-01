import { PG_URI } from "./../../config/settings";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({ connectionString: PG_URI });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
