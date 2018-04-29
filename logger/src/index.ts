import * as fs from 'fs';
import { Logger, LoggerConfiguration } from "./logger";

let config:LoggerConfiguration = JSON.parse(fs.readFileSync("./config.json").toString());

const logger = new Logger(config);
