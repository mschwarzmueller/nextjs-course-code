import { Labels } from './Metric';
/**
 * Interface that is being used in callback function for Observer Metric
 */
export interface ObserverResult {
    observe(value: number, labels: Labels): void;
}
//# sourceMappingURL=ObserverResult.d.ts.map