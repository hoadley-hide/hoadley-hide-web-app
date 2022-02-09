import type { IncomingMessage, ServerResponse } from "http";
import { ReviewQuestion, ReviewQuestionRaw } from "~/types";
import { simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    heading
    storageKey
    description
    tickLabels
  }`;

  const returnable = await simpleAllGraphQL<ReviewQuestionRaw, ReviewQuestion>(
    "reviewQuestions",
    `{ reviewQuestions ${fields} }`,
    {},
    (reviewQuestion): ReviewQuestion => ({
      _type: "reviewQuestion",
      id: reviewQuestion.id,
      heading: reviewQuestion.heading,
      storageKey: reviewQuestion.storageKey,
      description: reviewQuestion.description,
      tickLabels: reviewQuestion.tickLabels,
    })
  );

  res.statusCode = 200;
  return returnable;
};
