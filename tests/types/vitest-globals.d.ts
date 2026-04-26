import type { Mock as VitestMock, Mocked as VitestMocked, MockedFunction as VitestMockedFunction } from 'vitest';

declare global {
  type Mock = VitestMock;
  type Mocked<T> = VitestMocked<T>;
  type MockedFunction<T extends (...args: never[]) => unknown> = VitestMockedFunction<T>;
}

export {};
