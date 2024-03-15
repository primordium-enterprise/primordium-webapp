import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import en from "dayjs/locale/en";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
// dayjs.extend(localizedFormat);
dayjs.locale(en);

export default dayjs;