import { isoDateRegExp } from '@lib/patterns';

class DateClient {
  private static instance: any;

  static getInstance(): DateClient {
    if (!DateClient.instance) {
      DateClient.instance = new DateClient();
    }

    return DateClient.instance;
  }

  addMinutesToDate(minutes: number, date: string): Date {
    const currentDate = new Date(date);
    currentDate.setMinutes(currentDate.getMinutes() + minutes);
    return currentDate;
  }

  getIsoDateBackdatedByMonth(isEndOfDay: boolean, month: number): string {
    const currentDate = new Date();
    if (isEndOfDay) currentDate.setHours(23, 59, 59, 999);
    else currentDate.setHours(0, 0, 0, 0);
    currentDate.setUTCMonth(currentDate.getUTCMonth() - (month ?? 12));
    return currentDate.toISOString();
  }

  isISODate(str: string) {
    return isoDateRegExp.test(str);
  }
}

const dateClient = DateClient.getInstance();
export default dateClient;
