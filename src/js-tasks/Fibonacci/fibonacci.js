function fibonacci(n) {
    if (n === 0) {
        return 0;
    } else if (n === 1) {
        return 1;
    } else {
        // Рекурсивні виклики для n-1 та n-2
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

export { fibonacci };