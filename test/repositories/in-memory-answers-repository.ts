import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async save(answer: Answer): Promise<Answer> {
    const index = this.items.findIndex((item) => item.id === answer.id)

    this.items[index] = answer
    return this.items[index]
  }

  async findById(answerId: string) {
    const answer = this.items.find((item) => item.id.toString() === answerId)

    return answer ?? null
  }

  create(answer: Answer): Promise<void> {
    this.items.push(answer)
    return Promise.resolve()
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id)

    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }
}
