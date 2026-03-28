import busboy from "busboy"
import { IncomingHttpHeaders } from "http";

export const busboyUploader = (headers: IncomingHttpHeaders) => {
  busboy({ headers });
};