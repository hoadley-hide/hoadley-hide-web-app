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
      content: wikiArticle.content.map((content) => {
        const h = content.html.match(/<h\d>(.+?)<\/h\d>/);
        const heading = h ? h[1] : content.text.substring(0, 20);
        return {
          html: content.html.replace(/<h\d>.+?<\/h\d>/, ""),
          text: content.text,
          heading: heading,
          tab: heading.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase(),
        };
      }),
      tags: wikiArticle.tags,
    })
  );

  res.statusCode = 200;
  return returnable;
};
