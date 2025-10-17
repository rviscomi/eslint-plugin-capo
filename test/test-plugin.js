/**
 * Simple test runner for eslint-plugin-capo
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import plugin from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing eslint-plugin-capo v1.1.0\n');

// Simple validation tests
function testPluginStructure() {
  console.log('Testing plugin structure...');
  
  // Check plugin meta
  if (!plugin.meta || plugin.meta.name !== 'eslint-plugin-capo') {
    throw new Error('Plugin meta is invalid');
  }
  if (plugin.meta.version !== '1.1.0') {
    throw new Error(`Plugin version should be 1.1.0, got ${plugin.meta.version}`);
  }
  console.log('  ✅ Plugin meta valid (v1.1.0)');
  
  // Check rules
  const expectedRules = [
    'no-invalid-head-elements',
    'require-title',
    'no-duplicate-base',
    'no-meta-csp',
    'no-invalid-http-equiv',
    'valid-meta-viewport',
    'valid-charset',
    'no-default-style',
    'head-element-order',
  ];
  
  for (const ruleName of expectedRules) {
    if (!plugin.rules[ruleName]) {
      throw new Error(`Rule ${ruleName} not found`);
    }
    if (!plugin.rules[ruleName].meta) {
      throw new Error(`Rule ${ruleName} missing meta`);
    }
    if (!plugin.rules[ruleName].create) {
      throw new Error(`Rule ${ruleName} missing create function`);
    }
  }
  console.log(`  ✅ All ${expectedRules.length} rules valid`);
  
  // Check configs
  const expectedConfigs = ['recommended', 'strict', 'performance', 'accessibility', 'ordering'];
  for (const configName of expectedConfigs) {
    if (!plugin.configs[configName]) {
      throw new Error(`Config ${configName} not found`);
    }
  }
  console.log(`  ✅ All ${expectedConfigs.length} configs valid`);
  
  console.log();
}

// Test element ordering utilities
async function testElementOrdering() {
  console.log('Testing element ordering utilities...');
  
  const { getWeight, getElementTypeName, ElementWeights } = await import('../src/utils/element-ordering.js');
  
  // Test weight constants
  if (ElementWeights.META !== 10) throw new Error('META weight should be 10');
  if (ElementWeights.TITLE !== 9) throw new Error('TITLE weight should be 9');
  if (ElementWeights.DEFER_SCRIPT !== 2) throw new Error('DEFER_SCRIPT weight should be 2');
  console.log('  ✅ Element weight constants correct');
  
  // Create mock nodes
  const metaNode = { 
    name: 'meta', 
    attributes: [{ key: { name: 'charset' }, value: { value: 'utf-8' } }] 
  };
  const titleNode = { name: 'title', attributes: [] };
  const scriptDeferNode = { 
    name: 'script', 
    attributes: [
      { key: { name: 'src' }, value: { value: '/app.js' } },
      { key: { name: 'defer' } }
    ] 
  };
  
  // Test weight calculation
  const metaWeight = getWeight(metaNode);
  const titleWeight = getWeight(titleNode);
  const deferWeight = getWeight(scriptDeferNode);
  
  if (metaWeight !== 10) throw new Error(`META weight should be 10, got ${metaWeight}`);
  if (titleWeight !== 9) throw new Error(`TITLE weight should be 9, got ${titleWeight}`);
  if (deferWeight !== 2) throw new Error(`DEFER_SCRIPT weight should be 2, got ${deferWeight}`);
  
  console.log('  ✅ Element weight calculation correct');
  
  // Test type names
  const metaType = getElementTypeName(metaNode);
  const titleType = getElementTypeName(titleNode);
  const deferType = getElementTypeName(scriptDeferNode);
  
  if (metaType !== 'META') throw new Error(`META type should be 'META', got ${metaType}`);
  if (titleType !== 'TITLE') throw new Error(`TITLE type should be 'TITLE', got ${titleType}`);
  if (deferType !== 'DEFER_SCRIPT') throw new Error(`DEFER_SCRIPT type should be 'DEFER_SCRIPT', got ${deferType}`);
  
  console.log('  ✅ Element type names correct');
  console.log();
}

// Test validation helpers
async function testValidationHelpers() {
  console.log('Testing validation helpers...');
  
  const { isMetaCSP, isMetaViewport, isValidHeadElement } = await import('../src/utils/validation-helpers.js');
  
  // Test valid head elements
  if (!isValidHeadElement('meta')) throw new Error('meta should be valid');
  if (!isValidHeadElement('title')) throw new Error('title should be valid');
  if (!isValidHeadElement('link')) throw new Error('link should be valid');
  if (isValidHeadElement('div')) throw new Error('div should not be valid');
  if (isValidHeadElement('span')) throw new Error('span should not be valid');
  
  console.log('  ✅ Valid head element detection correct');
  
  // Test CSP detection
  const cspNode = {
    name: 'meta',
    attributes: [
      { key: { name: 'http-equiv' }, value: { type: 'Literal', value: 'Content-Security-Policy' } },
      { key: { name: 'content' }, value: { type: 'Literal', value: 'default-src self' } }
    ]
  };
  
  if (!isMetaCSP(cspNode)) throw new Error('Should detect CSP meta tag');
  
  console.log('  ✅ CSP detection correct');
  
  // Test viewport detection
  const viewportNode = {
    name: 'meta',
    attributes: [
      { key: { name: 'name' }, value: { type: 'Literal', value: 'viewport' } },
      { key: { name: 'content' }, value: { type: 'Literal', value: 'width=device-width' } }
    ]
  };
  
  if (!isMetaViewport(viewportNode)) throw new Error('Should detect viewport meta tag');
  
  console.log('  ✅ Viewport detection correct');
  console.log();
}

// Run tests
try {
  testPluginStructure();
  await testElementOrdering();
  await testValidationHelpers();
  
  console.log('✅ All tests passed!\n');
  console.log('📊 Summary:');
  console.log('  - 9 rules validated');
  console.log('  - 5 configuration presets validated');
  console.log('  - Element ordering utilities tested');
  console.log('  - Validation helpers tested');
  console.log();
  console.log('🎉 eslint-plugin-capo v1.1.0 is working correctly!');
  console.log();
  console.log('💡 To test on HTML files, install eslint-plugin-html and run:');
  console.log('   npx eslint examples/*.html');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}
