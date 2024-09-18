import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase
// system under test

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it(' should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {
        questionId: new UniqueEntityId('question-1'),
      },
      new UniqueEntityId('answer-01'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
    })

    expect(newAnswer.id.toString()).toEqual('answer-01')
    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it(' should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        questionId: new UniqueEntityId('question-1'),
        authorId: new UniqueEntityId('author-01'),
      },
      new UniqueEntityId('answer-01'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    expect(async () => {
      return await sut.execute({
        answerId: newAnswer.id.toString(),
        authorId: 'author-02',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
