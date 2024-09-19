import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete answer comment', async () => {
    const answer = makeAnswer({}, new UniqueEntityId('answer-id-01'))

    await inMemoryAnswersRepository.create(answer)

    const answerComment = makeAnswerComment(
      {},
      new UniqueEntityId('answerComment-id-01'),
    )

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete answer comment another user', async () => {
    const answer = makeAnswer({}, new UniqueEntityId('answer-id-01'))

    await inMemoryAnswersRepository.create(answer)

    const answerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityId('author-01'),
      },
      new UniqueEntityId('answerComment-id-01'),
    )

    await inMemoryAnswerCommentsRepository.create(answerComment)

    expect(async () => {
      return await sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: 'author-02',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
