import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

let sut: FetchAnswerCommentsUseCase
// system under test

describe('Fetch Comments By Answer', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it(' should be able to fetch comments by Answer', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({}, new UniqueEntityId('answer-id-01')),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-id-01'),
      }),
    )

    const { answerComments } = await sut.execute({
      page: 1,
      answerId: 'answer-id-01',
    })

    expect(answerComments).toEqual([
      expect.objectContaining({
        answerId: new UniqueEntityId('answer-id-01'),
      }),
    ])
  })

  it(' should be able to fetch paginated comments by answer', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({}, new UniqueEntityId('answer-id-01')),
    )

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-id-01'),
        }),
      )
    }

    const { answerComments } = await sut.execute({
      page: 2,
      answerId: 'answer-id-01',
    })

    expect(answerComments).toHaveLength(2)
  })
})
