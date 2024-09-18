import type { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  findById(answerId: string): Promise<Answer | null>
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<Answer>
  delete(answer: Answer): Promise<void>
}
