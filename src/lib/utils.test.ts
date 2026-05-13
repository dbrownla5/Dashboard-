import { test } from 'node:test';
import assert from 'node:assert';
import { cn } from './utils.ts';

test('cn utility', async (t) => {
  await t.test('merges tailwind classes correctly', () => {
    assert.strictEqual(cn('px-2', 'px-4'), 'px-4');
  });

  await t.test('handles conditional classes', () => {
    assert.strictEqual(cn('px-2', true && 'py-2', false && 'm-2'), 'px-2 py-2');
  });

  await t.test('handles multiple arguments', () => {
    assert.strictEqual(cn('px-2', 'py-2', 'bg-red-500'), 'px-2 py-2 bg-red-500');
  });

  await t.test('handles objects', () => {
    assert.strictEqual(cn({ 'bg-blue-500': true, 'text-white': false }), 'bg-blue-500');
  });

  await t.test('handles arrays', () => {
    assert.strictEqual(cn(['bg-blue-500', 'text-white']), 'bg-blue-500 text-white');
  });
});
