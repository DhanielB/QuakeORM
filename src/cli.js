#! /usr/bin/env node

const fs = require("fs");
const orm = require("./orm");
const parse = require("./parse");
const prettier = require("./utils/prettier");

async function generateMigration(name) {
  const projectPath = process.cwd();

  const fileContent = `
datasource db {
  url      = ENV("DATABASE_URL")
  provider = "postgresql"
}

model User {
  id         Int @id
  name       String
  email      String
}
`;

  const prettyCode = prettier(fileContent);
  const parsedCode = parse(prettyCode);

  const result = orm(parsedCode);

  console.log(result);
}
