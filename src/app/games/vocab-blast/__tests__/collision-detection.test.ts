/**
 * Tests for collision detection algorithms used in Vocab Blast theme engines
 */

interface TestObject {
  id: string;
  x: number;
  y: number;
  size?: number;
}

// Simplified collision detection function for testing
function checkCollisions(objects: TestObject[], minDistance: number = 150): TestObject[] {
  return objects.map((obj, index) => {
    let adjustedX = obj.x;
    let adjustedY = obj.y;
    let collisionCount = 0;

    objects.forEach((otherObj, otherIndex) => {
      if (index !== otherIndex) {
        const distance = Math.sqrt(
          Math.pow(obj.x - otherObj.x, 2) + Math.pow(obj.y - otherObj.y, 2)
        );

        if (distance < minDistance) {
          collisionCount++;
          const angle = Math.atan2(obj.y - otherObj.y, obj.x - otherObj.x);
          const pushDistance = minDistance + (collisionCount * 20);
          
          adjustedX = otherObj.x + Math.cos(angle) * pushDistance;
          adjustedY = otherObj.y + Math.sin(angle) * pushDistance;
        }
      }
    });

    return { ...obj, x: adjustedX, y: adjustedY };
  });
}

describe('Collision Detection', () => {
  test('should not modify objects that are far apart', () => {
    const objects: TestObject[] = [
      { id: '1', x: 100, y: 100 },
      { id: '2', x: 300, y: 300 }
    ];

    const result = checkCollisions(objects, 150);

    expect(result[0].x).toBe(100);
    expect(result[0].y).toBe(100);
    expect(result[1].x).toBe(300);
    expect(result[1].y).toBe(300);
  });

  test('should separate overlapping objects', () => {
    const objects: TestObject[] = [
      { id: '1', x: 100, y: 100 },
      { id: '2', x: 120, y: 120 } // Too close (distance ~28)
    ];

    const result = checkCollisions(objects, 150);

    // Objects should be moved apart
    const distance = Math.sqrt(
      Math.pow(result[0].x - result[1].x, 2) + Math.pow(result[0].y - result[1].y, 2)
    );
    
    expect(distance).toBeGreaterThan(140); // Should be close to minDistance
  });

  test('should handle multiple overlapping objects', () => {
    const objects: TestObject[] = [
      { id: '1', x: 100, y: 100 },
      { id: '2', x: 110, y: 110 },
      { id: '3', x: 120, y: 120 },
      { id: '4', x: 130, y: 130 }
    ];

    const result = checkCollisions(objects, 150);

    // All objects should be separated
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const distance = Math.sqrt(
          Math.pow(result[i].x - result[j].x, 2) + Math.pow(result[i].y - result[j].y, 2)
        );
        expect(distance).toBeGreaterThan(100); // Should have reasonable separation
      }
    }
  });

  test('should preserve object identity', () => {
    const objects: TestObject[] = [
      { id: '1', x: 100, y: 100 },
      { id: '2', x: 120, y: 120 }
    ];

    const result = checkCollisions(objects, 150);

    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
    expect(result.length).toBe(2);
  });

  test('should handle edge case with single object', () => {
    const objects: TestObject[] = [
      { id: '1', x: 100, y: 100 }
    ];

    const result = checkCollisions(objects, 150);

    expect(result[0].x).toBe(100);
    expect(result[0].y).toBe(100);
    expect(result.length).toBe(1);
  });

  test('should handle empty array', () => {
    const objects: TestObject[] = [];
    const result = checkCollisions(objects, 150);
    
    expect(result).toEqual([]);
  });

  test('should work with different minimum distances', () => {
    const objects: TestObject[] = [
      { id: '1', x: 100, y: 100 },
      { id: '2', x: 180, y: 180 } // Distance ~113
    ];

    // With minDistance 100, should not separate
    const result1 = checkCollisions(objects, 100);
    expect(result1[0].x).toBe(100);
    expect(result1[1].x).toBe(180);

    // With minDistance 150, should separate
    const result2 = checkCollisions(objects, 150);
    const distance = Math.sqrt(
      Math.pow(result2[0].x - result2[1].x, 2) + Math.pow(result2[0].y - result2[1].y, 2)
    );
    expect(distance).toBeGreaterThan(140);
  });
});
