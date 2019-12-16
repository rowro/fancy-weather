import '@testing-library/jest-dom/extend-expect';
import formatCoords from '../src/scripts/helpers/coords';
import { createEl } from '../src/scripts/helpers/createEl';
import toFahrenheit from '../src/scripts/helpers/temperature';

describe('formatCoords', () => {
  test('should be format latitude or longitude', () => {
    expect(formatCoords(42.3541)).toBe('42°35');
    expect(formatCoords(12.543)).toBe('12°54');
  });
});

describe('createEl', () => {
  test('should append DOM element to document', () => {
    const el = createEl({ tag: 'div', appendTo: document.body });
    expect(el).toBeInTheDocument();
  });
});

describe('toFarenheit', () => {
  test('should convert Celsius to Fahrenheit', () => {
    expect(toFahrenheit(20)).toBe(68);
    expect(toFahrenheit(22)).toBe(71);
  });
});