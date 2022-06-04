export const createUserISentMostMessagesQuery = (userId: string): string => {
    return `
    with currentUser as (
        select coalesce(cmu."usersId", NULL) as userId,
            coalesce(u."login", NULL) as login
        from messages m
            join chats_members_users cmu on cmu."chatsId" = m."chatId"
            join users u on cmu."usersId" = u."id"
        where m."userId" = '${userId}'
        and cmu."usersId" != '${userId}'
        GROUP BY userId, login
        ORDER BY count(*) DESC
        limit 1
    ),
    messagesToUser as (
        select * from messages m
            join chats_members_users cmu on cmu."chatsId" = m."chatId"
        where m."userId" = '${userId}'
        and cmu."usersId" = (select userId from currentUser)
    ),
    smilingCount as (
        select count(*) as smiling from messagesToUser
        where "isSmiling" = true
    ),
    neutralCount as (
        select count(*) as neutral from messagesToUser
        where "isSmiling" = false
    ) select
        userId,
        login,
        CAST(coalesce(smiling, '0') AS integer) as smiling,
        CAST(coalesce(neutral, '0') AS integer) as neutral
    from smilingCount, neutralCount, currentUser;
    `;
};
