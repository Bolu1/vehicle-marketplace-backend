import winston from "winston";
import settings from "./settings";

const enumerateErrorFormat: winston.Logform.FormatWrap = winston.format(
  (info: any) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  }
);

const logger: winston.Logger = winston.createLogger({
  level: settings.serverEnvironment === "DEVELOPMENT" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    settings.serverEnvironment === "DEVELOPMENT"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(
      ({ level, message }: { level: string; message: string }) =>
        `${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;
