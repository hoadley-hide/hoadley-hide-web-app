import { dateHelper } from "~/plugins/filters";
import { Question } from "~/types";

export function isValid(question: Question, data: any): boolean {
  if (question.questionFieldType === "Time") {
    return typeof dateHelper(data) !== "string";
  } else if (question.questionFieldType === "StuntPicker") {
    return !!data;
  } else if (question.questionFieldType === "LongAnswer") {
    return !!data;
  } else if (question.questionFieldType === "ShortAnswer") {
    return !!data;
  } else if (question.questionFieldType === "VerticalRating") {
    return (
      Number.isInteger(data) && 0 <= data && data <= question.tickLabels.length
    );
  } else if (question.questionFieldType === "Rating") {
    return (
      Number.isInteger(data) && 0 <= data && data <= question.tickLabels.length
    );
  }
  return false;
}
