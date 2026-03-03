import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: this.configService.get("PG_URI"),
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
