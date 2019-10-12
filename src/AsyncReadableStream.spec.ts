/*!
 * Copyright 2019 yangjunbao <yangjunbao@shimo.im>. All rights reserved.
 * @since 2019-10-10 12:25:48
 */

import { sleep } from 'monofile-utilities/lib/sleep';
import { AsyncReadableStream } from './AsyncReadableStream';
import { createReadable, resolveReadable } from './utils';

describe('AsyncReadableStream', () => {
  it('should process chunks correctly', async () => {
    const asyncReadable = new AsyncReadableStream();
    asyncReadable.pushChunk('string'); // string
    asyncReadable.pushChunk(Buffer.from('buffer')); // buffer
    asyncReadable.pushChunk(createReadable(2)); // readable stream
    asyncReadable.pushChunk(sleep(1).then(() => 'promise')); // promise
    asyncReadable.pushChunk([
      'array-string',
      sleep(1).then(() => 'array-promise'),
      createReadable(2, 'array-readable-'),
    ]);
    asyncReadable.pushChunk('final-string');
    const chunks = await resolveReadable(asyncReadable);
    expect(chunks).toEqual([
      'string',
      'buffer',
      'readable-2',
      'readable-1',
      'promise',
      'array-string',
      'array-promise',
      'array-readable-2',
      'array-readable-1',
      'final-string',
    ]);
  });
});
