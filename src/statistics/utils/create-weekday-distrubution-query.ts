export const createWeekdayDestributionQuery = (userId: string): string =>
    `select 
        extract(isodow from "createdAt") as "weekday",
        "isSmiling",
        CAST(coalesce(count(*), '0') AS integer) as count
    from messages
    where "userId" = '${userId}'
    group by "weekday", "isSmiling";
    `;
