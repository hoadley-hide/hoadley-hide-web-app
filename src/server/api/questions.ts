import type { IncomingMessage, ServerResponse } from "http";
import { Question, QuestionRaw } from "~/types";
import { simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    heading
    storageKey
    questionFieldType
    questionGroup
    description
    tickLabels
    sortOrder
  }`;

  const returnable = await simpleAllGraphQL<QuestionRaw, Question>(
    "questions",
    `{ questions ${fields} }`,
    {},
    (question): Question => ({
      _type: "question",
      id: question.id,
      heading: question.heading,
      storageKey: question.storageKey,
      questionFieldType: question.questionFieldType,
      questionGroup: question.questionGroup.replace(
        /_/g,
        ":"
      ) as unknown as Question["questionGroup"],
      description: question.description,
      tickLabels: question.tickLabels,
      sortOrder: question.sortOrder,
    })
  );

  res.statusCode = 200;
  return returnable;
};
