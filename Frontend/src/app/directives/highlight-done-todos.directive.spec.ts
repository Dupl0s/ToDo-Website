import { HighlightDoneTodosDirective } from './highlight-done-todos.directive';

describe('HighlightDoneTodosDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = { nativeElement: document.createElement('div') } as any;
    const directive = new HighlightDoneTodosDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
