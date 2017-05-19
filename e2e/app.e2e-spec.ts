import { TaskTrackerPage } from './app.po';

describe('task-tracker App', () => {
  let page: TaskTrackerPage;

  beforeEach(() => {
    page = new TaskTrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
