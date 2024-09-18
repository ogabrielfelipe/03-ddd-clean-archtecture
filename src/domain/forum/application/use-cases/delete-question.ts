import type { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error(`Question with id "${questionId}" not found`)
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Unauthorized to delete this question')
    }

    await this.questionsRepository.delete(question)

    return {}
  }
}
