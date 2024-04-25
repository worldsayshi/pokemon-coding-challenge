
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500;
    if (exception.hasOwnProperty("getStatus")) {
        status = (exception as HttpException).getStatus();
    }

    let content = null;
    try {
        content = JSON.stringify(await exception);
    } catch (error) {
        console.error("Could not stringify error content");
    }
    // if (exception.hasOwnProperty("then")) {
    //     content = JSON.stringify(await exception);
    // } else {
    //     content = JSON.stringify(await exception);
    // }

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        content,
      });
  }
}
