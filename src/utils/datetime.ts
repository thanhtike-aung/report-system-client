import { formatDistanceToNowStrict } from "date-fns";

export function timeAgo(timeString: string) {
  return formatDistanceToNowStrict(new Date(timeString), { addSuffix: true });
}
