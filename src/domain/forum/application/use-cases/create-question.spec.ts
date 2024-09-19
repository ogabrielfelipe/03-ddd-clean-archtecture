import { InMemoryQuestionsRepository } from './../../../../../test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase
// system under test

describe('Crete Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it(' should be able to create a question', async () => {
    const { value } = await sut.execute({
      content: 'this is a new question',
      authorId: '1',
      title: 'Nova pergunta',
    })

    expect(value?.question.id).toBeTruthy()
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(value?.question.id)
  })
})
