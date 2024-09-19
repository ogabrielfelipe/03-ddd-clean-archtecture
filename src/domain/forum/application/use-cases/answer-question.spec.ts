import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create an Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to create an answer', async () => {
    const { value } = await sut.execute({
      content: 'Nova resposta',
      instructorId: '1',
      questionId: '2',
    })

    expect(value?.answer.id).toBeTruthy()
    expect(inMemoryAnswersRepository.items[0].id).toEqual(value?.answer.id)
  })
})
