import type { IncomingMessage, ServerResponse } from "http";
import { WikiArticle, WikiArticleRaw } from "~/types";
import { EntityType, generateCode, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    name
    shortName
    slug
    content { html text }
    tags
  }`;

  const returnable = await simpleAllGraphQL<WikiArticleRaw, WikiArticle>(
    "wikiArticles",
    `{ wikiArticles ${fields} }`,
    {},
    (wikiArticle): WikiArticle => ({
      _type: "wikiArticle",
      id: wikiArticle.id,
      code: generateCode(EntityType.WikiArticle, wikiArticle.id),
      name: wikiArticle.name,
      shortName: wikiArticle.shortName,
      slug: wikiArticle.slug,
      path: `/wiki/${wikiArticle.slug}`,
      content: wikiArticle.content.html,
      contentText: wikiArticle.content.text,
      tags: wikiArticle.tags,
    })
  );

  res.statusCode = 200;
  return returnable;
};
