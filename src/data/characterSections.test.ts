import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCharacterSections } from './mockSanityData';

describe('buildCharacterSections', () => {
  it('creates a default section list with appearance, history and recent events', () => {
    const sections = buildCharacterSections({
      appearance: 'Tall, lean, dark eyes.',
      character: 'Courageous and disciplined.',
      history: 'Raised in Winterfell.',
      recentEvents: 'Returned from the Wall.',
    });

    assert.deepEqual(
      sections.map((section) => section.title),
      ['Appearance and Character', 'History', 'Recent Events']
    );
    assert.ok(sections[0].content.includes('Tall, lean, dark eyes.'));
    assert.ok(sections[0].content.includes('Courageous and disciplined.'));
  });
});
