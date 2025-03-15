import { instance, mock, verify, when } from 'ts-mockito';
import { resolvableInstance } from './resolvableInstance';

describe('resolvableInstance', () => {
  // https://github.com/NagRock/ts-mockito/issues/191#issuecomment-708743761
  it('should not freeze', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Child {}

    interface Parent {
      getChild(): Promise<Child>;
    }

    const parentMock = mock<Parent>();
    const childMock = mock<Child>();

    const childExpected = resolvableInstance(childMock);

    when(parentMock.getChild()).thenResolve(childExpected);

    const parent = instance(parentMock);

    // act
    const child = await parent.getChild();

    // assert
    expect(child === childExpected).toBeTruthy();
    verify(parentMock.getChild()).once();
  });
});
