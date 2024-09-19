import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAnswersRepository } from './../../../../../test/repositories/in-memory-answers-repository'
import { FetchQuestionsAnswersUseCase } from './fetch-question-answers'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchQuestionsAnswersUseCase
// system under test

describe('Fetch Answers By Question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionsAnswersUseCase(inMemoryAnswersRepository)
  })

  it(' should be able to fetch answers by Question', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({}, new UniqueEntityId('question-id-01')),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-id-01'),
      }),
    )

    const { answers } = await sut.execute({
      page: 1,
      questionId: 'question-id-01',
    })

    expect(answers).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityId('question-id-01'),
      }),
    ])
  })

  it(' should be able to fetch paginated answers by question', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({}, new UniqueEntityId('question-id-01')),
    )

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId('question-id-01'),
        }),
      )
    }

    const { answers } = await sut.execute({
      page: 2,
      questionId: 'question-id-01',
    })

    expect(answers).toHaveLength(2)
  })
})
