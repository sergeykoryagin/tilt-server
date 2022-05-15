import { Weekday } from 'src/interfaces/weekday';
import { WeekdayDistributionResult } from 'src/interfaces/weekday-distribution-result';
import { WeekdayDistributionDto } from '../dto/weekday-distribution.dto';

export const convertToWeekdayDto = (
    distributions: Array<WeekdayDistributionResult>,
): WeekdayDistributionDto => {
    const result: WeekdayDistributionDto = {
        [Weekday.MONDAY]: { smiling: 0, neutral: 0 },
        [Weekday.THUESDAY]: { smiling: 0, neutral: 0 },
        [Weekday.WEDNESDAY]: { smiling: 0, neutral: 0 },
        [Weekday.THURSDAY]: { smiling: 0, neutral: 0 },
        [Weekday.FRIDAY]: { smiling: 0, neutral: 0 },
        [Weekday.SATURDAY]: { smiling: 0, neutral: 0 },
        [Weekday.SUNDAY]: { smiling: 0, neutral: 0 },
    };
    distributions.forEach((distribution: WeekdayDistributionResult) => {
        const weekday = result[distribution.weekday];
        if (distribution.isSmiling) {
            weekday.smiling += distribution.count;
        } else {
            weekday.neutral += distribution.count;
        }
    });
    return result;
};
