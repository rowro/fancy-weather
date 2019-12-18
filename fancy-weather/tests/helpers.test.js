import '@testing-library/jest-dom/extend-expect';
import formatCoords from '../src/scripts/helpers/coords';
import { createEl } from '../src/scripts/helpers/createEl';
import toFahrenheit from '../src/scripts/helpers/temperature';
import {
  formatDate,
  formatTime,
  formatWeek,
  getDayTime,
  getSeason,
} from '../src/scripts/helpers/date';

describe('Coords functions', () => {
  describe('formatCoords', () => {
    test('should be format latitude or longitude', () => {
      expect(formatCoords(42.3541)).toBe('42°35');
      expect(formatCoords(12.543)).toBe('12°54');
    });
  });
});


describe('DOM functions', () => {
  describe('createEl', () => {
    test('should append DOM element to document', () => {
      const el = createEl({ tag: 'div', appendTo: document.body });
      expect(el).toBeInTheDocument();
    });
  });
});


describe('Temperature functions', () => {
  describe('toFarenheit', () => {
    test('should convert Celsius to Fahrenheit', () => {
      expect(toFahrenheit(20)).toBe(68);
      expect(toFahrenheit(22)).toBe(71);
    });
  });
});


describe('Date functions', () => {
  const date = new Date(2019, 11, 16, 12, 54, 0, 0);

  describe('formatDate', () => {
    test('should return date in "ddd,MMMM D" format in English', () => {
      expect(formatDate(date, 'en', 'Europe/Moscow')).toBe('Mon, 16 December');
    });

    test('should return date in "ddd,MMMM D" format in Russian', () => {
      expect(formatDate(date, 'ru', 'Europe/Moscow')).toBe('пн, 16 декабря');
    });

    test('should return date in "ddd,MMMM D" format in Belorussian', () => {
      expect(formatDate(date, 'be', 'Europe/Moscow')).toBe('Пн, 16 Снежня');
    });
  });

  describe('formatTime', () => {
    test('should return time in hh:mm format', () => {
      expect(formatTime(date, 'en', 'Europe/Moscow')).toBe('12:54');
    });
  });

  describe('formatWeek', () => {
    test('should return full name of the day week in English', () => {
      expect(formatWeek(date, 'en', 'Europe/Moscow')).toBe('Monday');
    });

    test('should return full name of the day week in Russian', () => {
      expect(formatWeek(date, 'ru', 'Europe/Moscow')).toBe('понедельник');
    });

    test('should return full name of the day week in Belorussian', () => {
      expect(formatWeek(date, 'be', 'Europe/Moscow')).toBe('панядзелак');
    });
  });

  describe('getSeason', () => {
    test('should return year season', () => {
      expect(getSeason(date)).toBe('winter');
    });
  });

  describe('getDayTime', () => {
    test('should return day time, day or night', () => {
      const nightDate = new Date(2019, 11, 16, 23, 3, 0, 0);
      expect(getDayTime(date)).toBe('day');
      expect(getDayTime(nightDate)).toBe('night');
    });
  });
});
