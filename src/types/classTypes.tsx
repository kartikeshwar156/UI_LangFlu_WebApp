/**
 * Class representing a question-answer pair for language practice
 */
export class QuestionAnswer {
  quest?: string;
  user_answer?: string;
  expected_answer?: string;

  constructor(quest: string = "", user_answer: string = "", expected_answer: string = "") {
    this.quest = quest;
    this.user_answer = user_answer;
    this.expected_answer = expected_answer;
  }
}

export class QuestionAnswerResponseList {
  question_answers?: QuestionAnswer[];
}

export class LLM_Response {
  next_question?: string;
  suggested_answer?: string;
}
