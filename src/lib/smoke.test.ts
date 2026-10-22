import { describe, expect, it } from 'vitest'

describe('test environment', () => {
  it('runs unit tests in a Node environment', () => {
    expect(true).toBe(true)
  })
})
