import type { Question } from '../../enterprise/entities/question'
import type { QuestionsRepository } from '../repositories/questions-repository'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
}

interface EditQuestionUseCaseResponse {
  question: Question
}

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error(`Question with id "${questionId}" not found`)
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Unauthorized to Edit this question')
    }

    question.title = title
    question.content = content

    const questionEdited = await this.questionsRepository.save(question)

    return {
      question: questionEdited,
    }
  }
}
