import { Labels } from './Metric';
import { Observation } from './Observation';
/**
 * Interface that is being used in callback function for Observer Metric
 * for batch
 */
export interface BatchObserverResult {
    /**
     * Used to observe (update) observations for certain labels
     * @param labels
     * @param observations
     */
    observe(labels: Labels, observations: Observation[]): void;
}
//# sourceMappingURL=BatchObserverResult.d.ts.map