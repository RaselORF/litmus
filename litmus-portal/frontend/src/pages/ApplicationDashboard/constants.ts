export const PROMETHEUS_ERROR_QUERY_RESOLUTION_LIMIT_REACHED: string = `bad_data: exceeded maximum resolution of 11,000 points per timeseries. Try decreasing the query resolution (?step=XX)`;
export const DEFAULT_CHAOS_EVENT_AND_VERDICT_PROMETHEUS_QUERY_RESOLUTION: string = `1/2`;
export const DEFAULT_CHAOS_EVENT_AND_VERDICT_PROMETHEUS_QUERY_LEGEND: string = `{{chaosresult_name}}`;
export const CHAOS_EXPERIMENT_VERDICT_PASS: string = 'Pass';
export const CHAOS_EXPERIMENT_VERDICT_FAIL: string = 'Fail';
export const CHAOS_EXPERIMENT_VERDICT_FAILED_TO_INJECT: string = `Failed to Inject`;
export const PROMETHEUS_QUERY_RESOLUTION_LIMIT: number = 11000;
export const INVALID_REFRESH_RATE: number = 0;
export const DEFAULT_REFRESH_RATE: number = 15;
export const ACTIVE: string = 'Active';
export const INVALID_RELATIVE_TIME_RANGE: number = 0;
export const DEFAULT_RELATIVE_TIME_RANGE: number = 1800;
export const INVALID_DATE: string = '';
export const TIME_DEVIATION_THRESHOLD_FOR_CONTROL_STACK_OBJECTS: number = 5; /* Optimal value - Minimum refresh rate of the dashboard */
export const DEFAULT_TSDB_SCRAPE_INTERVAL: number = 5;
export const TIME_THRESHOLD_FOR_TSDB: number = 1;
export const DEFAULT_CHAOS_EVENT_QUERY_ID: string = 'chaos-event';
export const DEFAULT_CHAOS_VERDICT_QUERY_ID: string = 'chaos-verdict';
