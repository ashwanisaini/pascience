import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {

  transform(date, option,format) {
    return moment(date).format(format);
  }

}
