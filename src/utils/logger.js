const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

module.exports.logger = createLogger({
  level: "info",
  format: combine(timestamp(), myFormat),
  transports: [new transports.Console()],
});
