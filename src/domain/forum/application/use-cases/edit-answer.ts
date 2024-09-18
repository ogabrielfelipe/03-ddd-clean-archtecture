import type { Answer } from '../../enterprise/entities/answer'
import type { AnswersRepository } from '../repositories/answers-repository'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

interface EditAnswerUseCaseResponse {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error(`Answer with id "${answerId}" not found`)
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Unauthorized to Edit this answer')
    }

    answer.content = content

    const answerEdited = await this.answersRepository.save(answer)

    return {
      answer: answerEdited,
    }
  }
}
