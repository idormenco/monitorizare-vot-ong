export class EditableFormQuestionOption{
  constructor(
    public id: number,
    public text: string,
    public hint: string,
    public isFreeText: boolean=false,
    public isFlagged: boolean = false
  ) {}
}
