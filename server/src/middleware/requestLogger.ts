import morgan from "morgan";
import logger from "../utils/logger";

morgan.token("id", (req: any) => req.requestId);

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

const requestLogger = morgan(
  ":id :method :url :status :response-time ms - :res[content-length]",
  { stream }
);

export default requestLogger;