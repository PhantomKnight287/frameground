import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const fromNow = (date: string | Date, withoutSuffix?: boolean) =>
  dayjs(date).fromNow(withoutSuffix);
