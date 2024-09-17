import { AnswerQuestionUseCase } from './answer-question'
import type { AnswerRepository } from '../repositories/answers-repository'
import type { Answer } from '../entities/answer';

const fakeAnswerRepository: AnswerRepository = {
    create: async (answer: Answer) => {
        return;
    }
}


test('create an answer', async () => {
    const answerQuestion = new AnswerQuestionUseCase(fakeAnswerRepository)

    const answer = await answerQuestion.execute({
        content: 'Nova resposta',
        instructorId: '1',
        questionId: '2',
    })


    expect(answer.content).toEqual('Nova resposta')
})