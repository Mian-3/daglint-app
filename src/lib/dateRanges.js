export function getDateRange(range, fromParam, toParam) {
  const now = new Date();
  let start, end;

  switch (range) {
    case "today": {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      break;
    }
    case "7d": {
      start = new Date(now);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "month": {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;
    }
    case "year": {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    }
    case "custom": {
      start = fromParam ? new Date(fromParam) : new Date(0);
      end = toParam ? new Date(toParam + "T23:59:59") : new Date();
      break;
    }
    case "all":
    default: {
      start = new Date(0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }
  }

  return { start, end };
}

export const RANGE_LABELS = {
  today: "Today",
  "7d": "Last 7 Days",
  month: "This Month",
  year: "This Year",
  custom: "Custom Range",
  all: "All Time",
};