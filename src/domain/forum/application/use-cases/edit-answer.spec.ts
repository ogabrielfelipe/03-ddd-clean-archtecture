import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from './../../../../../test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase
// system under test

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it(' should be able to Edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-01'),
        content: 'This is a new answer',
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-01',
      content: 'This is an updated answer',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'This is an updated answer',
    })
  })

  it(' should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-01'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    expect(async () => {
      return await sut.execute({
        answerId: newAnswer.id.toString(),
        authorId: 'author-02',
        content: 'This is an updated answer',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
