import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NumericValuePipe implements PipeTransform {
  transform(value: string | number) {
    const strValue = value.toString();

    if (!/^\d+$/.test(strValue)) {
      throw new BadRequestException('ID must be a numeric value');
    }

    return strValue; 
  }
}