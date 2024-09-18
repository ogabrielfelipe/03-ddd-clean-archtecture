import type { Question } from '../../enterprise/entities/question'
import type { AnswersRepository } from '../repositories/answers-repository'
import type { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

interface ChooseQuestionBestAnswerUseCaseResponse {
  question: Question
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error(`Answer with id "${answerId}" not found`)
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      throw new Error(`Question with id "${answer.questionId}" not found`)
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Unauthorized to choose a best answer')
    }

    question.bestAnswerID = answer.id

    await this.questionRepository.save(question)

    return {
      question,
    }
  }
}
