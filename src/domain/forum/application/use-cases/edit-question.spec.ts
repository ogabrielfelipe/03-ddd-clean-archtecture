import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from './../../../../../test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase
// system under test

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it(' should be able to Edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        title: 'New Question',
        authorId: new UniqueEntityId('author-01'),
        content: 'This is a new question',
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-01',
      title: 'Updated Question',
      content: 'This is an updated question',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Updated Question',
      content: 'This is an updated question',
    })
  })

  it(' should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-01'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(async () => {
      return await sut.execute({
        questionId: newQuestion.id.toString(),
        authorId: 'author-02',
        title: 'Updated Question',
        content: 'This is an updated question',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
