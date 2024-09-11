exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.enu("role", ["SUPERUSER", "USER"]).defaultTo("USER").index();
      table.enu("status", ["ACTIVE", "SUSPENDED", "DELETED"]).defaultTo("ACTIVE").index();
      table.timestamp("lastLoggedInAt");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt");
      table.timestamp("deletedAt");
    })
    .then(() => {
      return knex.schema.createTable("listing", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("name").notNullable().index();
        table.string("make").notNullable().index();
        table.string("model").notNullable().index();
        table.integer("year").notNullable().index();
        table.float("price").notNullable().index();
        table.float("mileage").notNullable().index();
        table.string("gearType").notNullable().index();
        table.string("fuel").notNullable().index();
        table.string("color").notNullable().index();
        table.uuid("createdBy").unsigned().references("id").inTable("users").index();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt");
      });
    })
    .then(() => {
      return knex.schema.createTable("booking", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.uuid("listingId").unsigned().references("id").inTable("listing").index();
        table.uuid("userId").unsigned().references("id").inTable("users").index();
        table.timestamp("startDate").index();
        table.timestamp("endDate").index();
        table.enu("status", ["BOOKED", "CANCELLED"]).defaultTo("BOOKED");
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt");
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("booking")
    .then(() => knex.schema.dropTableIfExists("listing"))
    .then(() => knex.schema.dropTableIfExists("users"));
};