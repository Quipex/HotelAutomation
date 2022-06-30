import { BalconySide } from '~/common/types';

const getBalconySideText = (side: BalconySide) => {
  switch (side) {
    case BalconySide.SEA: {
      return 'на море';
    }
    case BalconySide.MIDDLE: {
      return 'в сторону';
    }
    case BalconySide.YARD: {
      return 'во двор';
    }
    default: {
      return side;
    }
  }
};

export { getBalconySideText };
