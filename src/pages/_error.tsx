import * as Sentry from "@sentry/nextjs";
import { IncomingMessage } from "http";

function Error({ statusCode }: { statusCode: number }) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
}

Error.getInitialProps = async (ctx: {
  res: any;
  req?: IncomingMessage | undefined;
  err: any;
}) => {
  await Sentry.captureUnderscoreErrorException(ctx);
  const statusCode = ctx.res
    ? ctx.res.statusCode
    : ctx.err
      ? ctx.err.statusCode
      : 404;
  return { statusCode };
};

export default Error;
