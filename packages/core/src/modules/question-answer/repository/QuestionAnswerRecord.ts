import type { RecordTags, TagsBase } from '../../../storage/BaseRecord'
import type { QuestionAnswerRole } from '../QuestionAnswerRole'
import type { QuestionAnswerState, ValidResponse } from '../models'

import { AriesFrameworkError } from '../../../error'
import { BaseRecord } from '../../../storage/BaseRecord'
import { uuid } from '../../../utils/uuid'

export type CustomQuestionAnswerTags = TagsBase
export type DefaultQuestionAnswerTags = {
  connectionId: string
  role: QuestionAnswerRole
  state: QuestionAnswerState
  threadId: string
}

export type QuestionAnswerTags = RecordTags<QuestionAnswerRecord>

export interface QuestionAnswerStorageProps {
  id?: string
  createdAt?: Date
  connectionId: string
  role: QuestionAnswerRole
  signatureRequired: boolean
  state: QuestionAnswerState
  tags?: CustomQuestionAnswerTags
  threadId: string

  questionText: string
  questionDetail?: string
  validResponses: ValidResponse[]

  response?: string
}

export class QuestionAnswerRecord extends BaseRecord<DefaultQuestionAnswerTags, CustomQuestionAnswerTags> {
  public questionText!: string
  public questionDetail?: string
  public validResponses!: ValidResponse[]
  public connectionId!: string
  public role!: QuestionAnswerRole
  public signatureRequired!: boolean
  public state!: QuestionAnswerState
  public threadId!: string
  public response?: string

  public static readonly type = 'QuestionAnswerRecord'
  public readonly type = QuestionAnswerRecord.type

  public constructor(props: QuestionAnswerStorageProps) {
    super()

    if (props) {
      this.id = props.id ?? uuid()
      this.createdAt = props.createdAt ?? new Date()
      this.questionText = props.questionText
      this.questionDetail = props.questionDetail
      this.validResponses = props.validResponses
      this.connectionId = props.connectionId
      this._tags = props.tags ?? {}
      this.role = props.role
      this.signatureRequired = props.signatureRequired
      this.state = props.state
      this.threadId = props.threadId
      this.response = props.response
    }
  }

  public getTags() {
    return {
      ...this._tags,
      connectionId: this.connectionId,
      role: this.role,
      state: this.state,
      threadId: this.threadId,
    }
  }

  public assertState(expectedStates: QuestionAnswerState | QuestionAnswerState[]) {
    if (!Array.isArray(expectedStates)) {
      expectedStates = [expectedStates]
    }

    if (!expectedStates.includes(this.state)) {
      throw new AriesFrameworkError(
        `Question answer record is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`
      )
    }
  }
}
