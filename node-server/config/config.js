require('dotenv').config();

const env = process.env;
// testing
const development = {
  username: env.AWS_MYSQL_USERNAME,
  password: env.AWS_MYSQL_PASSWORD,
  database: env.AWS_MYSQL_DATABASE,
  host: env.AWS_MYSQL_HOST,
  dialect: "mysql",
  port: '3306'
};

const test = {
  username: env.AWS_MYSQL_USERNAME,
  password: env.AWS_MYSQL_PASSWORD,
  database: env.AWS_MYSQL_DATABASE,
  host: env.AWS_MYSQL_HOST,
  dialect: "mysql",
  port: '3306'
}

const production = {
  username: env.AWS_MYSQL_USERNAME,
  password: env.AWS_MYSQL_PASSWORD,
  database: env.AWS_MYSQL_DATABASE,
  host: env.AWS_MYSQL_HOST,
  dialect: "mysql",
  port: '3306'
}

module.exports = {development, test, production};