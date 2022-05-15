export const createMonthStatisticsQuery = (userId: string): string => {
    return `
    with monthUserMessages as (
        select * from messages
        where "userId" = '${userId}'
        and date_part('year', "createdAt") = date_part('year', CURRENT_DATE)
        and date_part('month', "createdAt") = date_part('month', CURRENT_DATE)
    ),
    smilingCount as (
        select count(*) as smiling from monthUserMessages
        where "isSmiling" = true
    ),
    notSmilingCount as (
        select count(*) as neutral from monthUserMessages
        where "isSmiling" = false
    )
    select 
        CAST(coalesce(smiling, '0') AS integer) as smiling,
        CAST(coalesce(neutral, '0') AS integer) as neutral
    from smilingCount, notSmilingCount;`;
};
