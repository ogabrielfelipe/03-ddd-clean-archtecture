import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete question comment', async () => {
    const question = makeQuestion({}, new UniqueEntityId('question-id-01'))

    await inMemoryQuestionsRepository.create(question)

    const questionComment = makeQuestionComment(
      {},
      new UniqueEntityId('questionComment-id-01'),
    )

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete question comment another user', async () => {
    const question = makeQuestion({}, new UniqueEntityId('question-id-01'))

    await inMemoryQuestionsRepository.create(question)

    const questionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId('author-01'),
      },
      new UniqueEntityId('questionComment-id-01'),
    )

    await inMemoryQuestionCommentsRepository.create(questionComment)

    expect(async () => {
      return await sut.execute({
        questionCommentId: questionComment.id.toString(),
        authorId: 'author-02',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
