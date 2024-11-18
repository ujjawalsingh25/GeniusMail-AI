import { create, insert, search, type AnyOrama } from '@orama/orama'
import { db } from './server/db'
import { OramaClient } from './lib/orama';
import { turndown } from './lib/turndown';

const orama = new OramaClient('68589')
await orama.initialize()

// const orama = await create({
//     schema: {
//       subject: 'string',
//       body: 'string',
//       rawBody: 'string',
//       from: 'string',
//       to: 'string[]',
//       sentAt: 'string',
//       threadId: 'string',
//     //   embedding: 'vector[1536]', // Vector size must be expressed during schema initialization
//     },
// })


const emails = await db.email.findMany({
    select: {
        subject: true,
        body: true,
        from: true,
        to: true,
        sentAt: true,
        threadId: true,
        bodySnippet: true
      },
})

for(const email of emails) {
    const body = turndown.turndown(email.body ?? email.bodySnippet ?? "")
    // @ts-ignore
    await orama.insert({
        subject: email.subject,
        body: body,
        rawBody: email.bodySnippet ?? "",
        from: email.from.address,
        to: email.to.map(to  => to.address),
        sentAt: email.sentAt.toLocaleString(),
        threadId: email.threadId
    })
}

const searchResult = await orama.search({
    term: 'ujjawal',
})
for(const hit of searchResult.hits) {
    console.log(hit.document.subject);
}
