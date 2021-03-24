import { lgtm } from '.';

describe('[Function: lgtm]', () => {
  it('should return the expected response', async () => {
    expect(await lgtm()).toMatchSnapshot();
  });
});
