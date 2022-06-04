export const createStatisticsByUserQuery = (
    myId: string,
    userId: string,
): string => {
    return `
        with userMessages as (
            select * from messages m
            join chats_users_members cmu on c."chatsId" = m."chatId"
            where "userId" = '${myId}' 
            and cmu."usersId" = '${userId}'
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
