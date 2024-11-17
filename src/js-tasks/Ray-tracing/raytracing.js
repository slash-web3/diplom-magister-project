// Структура Vec3, що представляє тривимірний вектор
class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Нормалізація вектора
    normalize() {
        const len = this.length();
        return new Vec3(this.x / len, this.y / len, this.z / len);
    }

    // Довжина вектора
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // Скалярний добуток
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    // Віднімання векторів
    subtract(other) {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    // Множення на скаляр
    multiply(t) {
        return new Vec3(this.x * t, this.y * t, this.z * t);
    }

    // Додавання векторів
    add(other) {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    // Порівняння з мінімальним значенням
    max(other) {
        return new Vec3(Math.max(this.x, other.x), Math.max(this.y, other.y), Math.max(this.z, other.z));
    }

    // Порівняння з максимальним значенням
    min(other) {
        return new Vec3(Math.min(this.x, other.x), Math.min(this.y, other.y), Math.min(this.z, other.z));
    }
}

// Структура сфери
class Sphere {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }

    // Перевірка на перетин з променем
    hit(origin, direction) {
        const oc = origin.subtract(this.center);
        const a = direction.dot(direction);
        const b = 2.0 * oc.dot(direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const discriminant = b * b - 4.0 * a * c;

        if (discriminant > 0.0) {
            return (-b - Math.sqrt(discriminant)) / (2.0 * a);
        } else {
            return -1.0;
        }
    }
}

// Генерація кольору на основі напрямку променя
function color(rayOrigin, rayDirection, sphere) {
    const t = sphere.hit(rayOrigin, rayDirection);
    if (t > 0.0) {
        // Якщо промінь перетинає сферу, повертаємо колір
        const hitPoint = rayOrigin.add(rayDirection.multiply(t));
        const normal = hitPoint.subtract(sphere.center).normalize();
        return new Vec3(normal.x * 255.0, normal.y * 255.0, normal.z * 255.0);
    } else {
        // Якщо промінь не перетинає сферу, фон
        return new Vec3(0.5, 0.7, 1.0).multiply(255.0); // Небо
    }
}

// Локальне освітлення та ефекти
function lighting(rayOrigin, rayDirection, sphere) {
    const t = sphere.hit(rayOrigin, rayDirection);
    if (t > 0.0) {
        // Точка на поверхні сфери
        const hitPoint = rayOrigin.add(rayDirection.multiply(t));
        // Нормаль до поверхні
        const normal = hitPoint.subtract(sphere.center).normalize();

        // Статичні позиції джерел світла
        const lightPositions = [
            new Vec3(2.0, 2.0, -2.0),  // Джерело світла 1
            new Vec3(-2.0, 2.0, -2.0), // Джерело світла 2
        ];

        let color = new Vec3(0.0, 0.0, 0.0);

        for (let lightPosition of lightPositions) {
            // Напрямок світла від точки до джерела
            const lightDirection = lightPosition.subtract(hitPoint).normalize();

            // Дифузне освітлення (скалярний добуток нормалі та напрямку світла)
            const diff = normal.dot(lightDirection) > 0.0 ? normal.dot(lightDirection) : 0.0;

            // Спекулярне освітлення (відбиття)
            const reflectDirection = normal.multiply(2.0 * normal.dot(lightDirection)).subtract(lightDirection).normalize();
            const viewDirection = rayOrigin.subtract(hitPoint).normalize();
            const spec = Math.pow(viewDirection.dot(reflectDirection) > 0.0 ? viewDirection.dot(reflectDirection) : 0.0, 16.0); // Чим більше значення, тим більше блиску

            // Колір матеріалу сфери (можна зробити червоним або будь-яким іншим)
            const baseColor = new Vec3(1.0, 0.0, 0.0); // Червоний колір сфери

            // Додаємо освітлення від джерела світла
            color = color.add(baseColor.multiply(diff * 0.7));  // Дифузне освітлення
            color = color.add(new Vec3(1.0, 1.0, 1.0).multiply(spec * 0.3));  // Спекулярне освітлення
        }

        // Амбієнтне освітлення
        color = color.add(new Vec3(0.1, 0.1, 0.1)); // Амбієнтне освітлення

        // Обмежуємо значення кольору для отримання яскравих кольорів
        color = color.multiply(255.0).max(new Vec3(0.0, 0.0, 0.0)).min(new Vec3(255.0, 255.0, 255.0));

        return color;
    }

    // Фон - колір неба
    return new Vec3(0.5, 0.7, 1.0).multiply(255.0);
}

// Генерація зображення
export function traceRay(width, height) {
    const pixels = [];
    const cameraOrigin = new Vec3(0.0, 0.0, 0.0);  // Камера в центр

    // Випадкові позиції сфер
    const sphere1 = new Sphere(new Vec3(Math.random() * 4 - 2, Math.random() * 2 - 1, -1.0), 0.5);
    const sphere2 = new Sphere(new Vec3(Math.random() * 4 - 2, Math.random() * 2 - 1, -1.0), 0.5);

    const spheres = [sphere1, sphere2];

    const lowerLeftCorner = new Vec3(-2.0, -1.0, -1.0);
    const horizontal = new Vec3(4.0, 0.0, 0.0);
    const vertical = new Vec3(0.0, 2.0, 0.0);

    for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
            const u = px / width;
            const v = py / height;
            const direction = lowerLeftCorner.add(horizontal.multiply(u)).add(vertical.multiply(v)).normalize();

            let col = new Vec3(0.5, 0.7, 1.0).multiply(255.0); // Небо

            // Перевірка на перетин з кожною сферою
            for (let sphere of spheres) {
                const t = sphere.hit(cameraOrigin, direction);
                if (t > 0.0) {
                    col = lighting(cameraOrigin, direction, sphere);
                }
            }

            // Додавання кольору пікселя
            pixels.push(col.x);
            pixels.push(col.y);
            pixels.push(col.z);
            pixels.push(255);  // Alpha
        }
    }

    return pixels;
}
