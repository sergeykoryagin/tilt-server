import { Weekday } from 'src/interfaces/weekday';
import { EmotionDistributionDto } from './emotion-distribution.dto';

export type WeekdayDistributionDto = {
    [key in Weekday]: EmotionDistributionDto;
};
