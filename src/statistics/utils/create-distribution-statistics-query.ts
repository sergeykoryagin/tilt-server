type StatisticsType = 'day' | 'month' | 'total';

const getDistributionStatisticsSubquery = (type: StatisticsType): string => {
    switch (type) {
        case 'day':
            return 'date("createdAt") = CURRENT_DATE';
        case 'month':
            return `date_part('year', "createdAt") = date_part('year', CURRENT_DATE)
        and date_part('month', "createdAt") = date_part('month', CURRENT_DATE)`;
        default:
            return 'true';
    }
};

export const createDistributionStatisticsQuery = (
    userId: string,
    type: StatisticsType = 'total',
): string => {
    const subquery = getDistributionStatisticsSubquery(type);
    return `
    with userMessages as (
        select * from messages
        where "userId" = '${userId}' 
        and ${subquery}
    ),
    smilingCount as (
        select count(*) as smiling from userMessages
        where "isSmiling" = true
    ),
    notSmilingCount as (
        select count(*) as neutral from userMessages
        where "isSmiling" = false
    )
    select 
        CAST(coalesce(smiling, '0') AS integer) as smiling,
        CAST(coalesce(neutral, '0') AS integer) as neutral
    from smilingCount, notSmilingCount;`;
};
