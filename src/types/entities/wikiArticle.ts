import { RichText } from "..";

export interface WikiArticle {
  _type: "wikiArticle";
  id: string;
  code: string;
  name: string;
  shortName: string;
  slug: string;
  path: string;
  content: RichText;
  tags: string[];
}

export interface WikiArticleRaw {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  content: RichText;
  tags: string[];
}
