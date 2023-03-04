import {
  HttpException,
  BadRequestException,
  InternalServerErrorException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class NormalizeResponseService {
  success<T = unknown>(data?: T, message?: string | null, path?: string) {
    return {
      ...(data ? { data } : {}),
      ...(message ? { message } : {}),
      path
    };
  }

  error(
    error: any,
    customMessage?: string,
    ExceptionClass?: new (...args: any) => HttpException
  ) {
    const errorIsString = typeof error === 'string';
    const errorMessage =
      errorIsString || (error as any)?.message
        ? (error as any)?.message || error
        : customMessage ||
          (Array.isArray(error)
            ? error[0]
            : "Hughh.🤦🏾 An error occurred while trying to process your request. It's not you, it's us. We'll look into it.🙏🏾");

    return /does not exist|been thanos-ed|not found/i.test(
      errorMessage as string
    )
      ? new NotFoundException(errorMessage)
      : errorIsString || ExceptionClass
      ? ExceptionClass
        ? new ExceptionClass(errorMessage)
        : new BadRequestException(errorMessage)
      : new InternalServerErrorException(errorMessage);
  }
}
