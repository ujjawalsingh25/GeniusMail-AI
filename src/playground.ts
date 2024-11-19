import { create, insert, search, type AnyOrama } from '@orama/orama'
import { db } from './server/db'
import { OramaClient } from './lib/orama';
import { turndown } from './lib/turndown';
import { getEmbeddings } from './lib/embeddings';

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


// const emails = await db.email.findMany({
//     select: {
//         subject: true,
//         body: true,
//         from: true,
//         to: true,
//         sentAt: true,
//         threadId: true,
//         bodySnippet: true
//       },
// })

// await Promise.all(emails.map(async (email) =>  {
//     const body = turndown.turndown(email.body ?? email.bodySnippet ?? "")
//     const embeddings = await getEmbeddings(body)
//     // console.log(embeddings.length);
//     // @ts-ignore
//     await orama.insert({
//         subject: email.subject,
//         body: body,
//         rawBody: email.bodySnippet ?? "",
//         from: email.from.address,
//         to: email.to.map(to  => to.address),
//         sentAt: email.sentAt.toLocaleString(),
//         threadId: email.threadId,
//         embeddings
//     })
// }))
// await orama.saveIndex()

const searchResult = await orama.vectorSearch({
    term: 'google',
})
for(const hit of searchResult.hits) {
    console.log(hit.document.subject);
}
