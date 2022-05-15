import { EmotionDistributionDto } from './emotion-distribution.dto';

export interface EmotionDistributionWithUserDto extends EmotionDistributionDto {
    userId: string;
}
