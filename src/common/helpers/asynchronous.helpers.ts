export const delay =
  (timeInMillis: number = 0) =>
    new Promise(resolve =>
      setTimeout(resolve, timeInMillis)
    );