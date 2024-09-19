import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error(`Answer comment with id "${answerCommentId}" not found`)
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error('Unauthorized to delete this comment')
    }

    await this.answerCommentRepository.delete(answerComment)

    return {}
  }
}
