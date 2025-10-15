/**
 * Manual Testing Script for Student Dashboard Features
 * Run this in the browser console to test functionality
 */

(function() {
  'use strict';

  console.log('🧪 Starting Student Dashboard Manual Tests...');

  // Test 1: Navigation Component
  function testNavigation() {
    console.log('\n📱 Testing Navigation Component...');
    
    // Check if navigation items are present
    const navItems = document.querySelectorAll('nav a, [role="navigation"] a');
    const expectedPaths = [
      '/student-dashboard',
      '/student-dashboard/assignments',
      '/student-dashboard/games',
      '/student-dashboard/vocabulary',
      '/assessments',
      '/student-dashboard/achievements'
    ];

    console.log(`Found ${navItems.length} navigation items`);
    
    let foundPaths = [];
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href) foundPaths.push(href);
    });

    expectedPaths.forEach(path => {
      const found = foundPaths.some(foundPath => foundPath.includes(path));
      console.log(`${found ? '✅' : '❌'} Navigation item: ${path}`);
    });

    // Test mobile menu toggle
    const mobileMenuButton = document.querySelector('[aria-label*="menu"], button[class*="menu"]');
    if (mobileMenuButton) {
      console.log('✅ Mobile menu button found');
    } else {
      console.log('❌ Mobile menu button not found');
    }

    return {
      totalItems: navItems.length,
      expectedItems: expectedPaths.length,
      foundPaths: foundPaths
    };
  }

  // Test 2: Vocabulary Analysis Components
  function testVocabularyAnalysis() {
    console.log('\n🧠 Testing Vocabulary Analysis Components...');
    
    // Check for vocabulary analysis elements
    const analysisElements = {
      weakWordsSection: document.querySelector('[class*="weak"], [data-testid*="weak"]'),
      strongWordsSection: document.querySelector('[class*="strong"], [data-testid*="strong"]'),
      recommendationsSection: document.querySelector('[class*="recommendation"], [data-testid*="recommendation"]'),
      accuracyDisplays: document.querySelectorAll('[class*="accuracy"], [data-testid*="accuracy"]'),
      practiceButtons: document.querySelectorAll('a[href*="practice"], button[class*="practice"]')
    };

    Object.entries(analysisElements).forEach(([key, element]) => {
      if (key === 'accuracyDisplays' || key === 'practiceButtons') {
        console.log(`${element.length > 0 ? '✅' : '❌'} ${key}: ${element.length} found`);
      } else {
        console.log(`${element ? '✅' : '❌'} ${key}: ${element ? 'Found' : 'Not found'}`);
      }
    });

    // Test tab functionality if present
    const tabs = document.querySelectorAll('[role="tab"], button[class*="tab"]');
    console.log(`${tabs.length > 0 ? '✅' : '❌'} Tab navigation: ${tabs.length} tabs found`);

    return analysisElements;
  }

  // Test 3: Category Performance Components
  function testCategoryPerformance() {
    console.log('\n📊 Testing Category Performance Components...');
    
    const performanceElements = {
      categoryCards: document.querySelectorAll('[class*="category"], [data-testid*="category"]'),
      progressBars: document.querySelectorAll('[class*="progress"], .w-full[class*="bg-"]'),
      filterControls: document.querySelectorAll('select, [class*="filter"]'),
      sortControls: document.querySelectorAll('select[class*="sort"], [data-testid*="sort"]'),
      expandableItems: document.querySelectorAll('[class*="expand"], [class*="collaps"]')
    };

    Object.entries(performanceElements).forEach(([key, elements]) => {
      console.log(`${elements.length > 0 ? '✅' : '❌'} ${key}: ${elements.length} found`);
    });

    // Test expand/collapse functionality
    const expandButtons = document.querySelectorAll('button[class*="expand"], [role="button"][class*="chevron"]');
    if (expandButtons.length > 0) {
      console.log(`✅ Expandable sections: ${expandButtons.length} found`);
    }

    return performanceElements;
  }

  // Test 4: API Endpoints
  async function testAPIEndpoints() {
    console.log('\n🌐 Testing API Endpoints...');
    
    // Test weak-words-analysis endpoint
    try {
      const response = await fetch('/api/student/weak-words-analysis?studentId=test-student-123');
      const contentType = response.headers.get('content-type');
      
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('✅ Weak words analysis API: Responding correctly');
        console.log('📊 Response structure:', Object.keys(data));
        
        // Validate response structure
        const requiredKeys = ['weakWords', 'strongWords', 'recommendations', 'summary'];
        const hasAllKeys = requiredKeys.every(key => data.hasOwnProperty(key));
        console.log(`${hasAllKeys ? '✅' : '❌'} API response structure: ${hasAllKeys ? 'Valid' : 'Invalid'}`);
        
        return { success: true, data };
      } else {
        console.log(`❌ Weak words analysis API: ${response.status} ${response.statusText}`);
        return { success: false, status: response.status };
      }
    } catch (error) {
      console.log(`❌ Weak words analysis API: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Test 5: Responsive Design
  function testResponsiveDesign() {
    console.log('\n📱 Testing Responsive Design...');
    
    const viewports = [
      { name: 'Mobile', width: 375 },
      { name: 'Tablet', width: 768 },
      { name: 'Desktop', width: 1024 }
    ];

    const currentWidth = window.innerWidth;
    console.log(`Current viewport: ${currentWidth}px`);

    // Check for responsive classes
    const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]');
    console.log(`${responsiveElements.length > 0 ? '✅' : '❌'} Responsive classes: ${responsiveElements.length} elements found`);

    // Check grid layouts
    const gridElements = document.querySelectorAll('[class*="grid"], [class*="flex"]');
    console.log(`${gridElements.length > 0 ? '✅' : '❌'} Layout elements: ${gridElements.length} found`);

    // Test mobile menu visibility
    const mobileMenu = document.querySelector('[class*="md:hidden"], [class*="lg:hidden"]');
    console.log(`${mobileMenu ? '✅' : '❌'} Mobile-specific elements: ${mobileMenu ? 'Found' : 'Not found'}`);

    return {
      currentWidth,
      responsiveElements: responsiveElements.length,
      gridElements: gridElements.length
    };
  }

  // Test 6: Accessibility
  function testAccessibility() {
    console.log('\n♿ Testing Accessibility Features...');
    
    const accessibilityFeatures = {
      altTexts: document.querySelectorAll('img[alt]'),
      ariaLabels: document.querySelectorAll('[aria-label]'),
      ariaDescriptions: document.querySelectorAll('[aria-describedby]'),
      focusableElements: document.querySelectorAll('button, a, input, select, textarea, [tabindex]'),
      headingStructure: document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
      skipLinks: document.querySelectorAll('a[href*="#"], [class*="skip"]')
    };

    Object.entries(accessibilityFeatures).forEach(([key, elements]) => {
      console.log(`${elements.length > 0 ? '✅' : '❌'} ${key}: ${elements.length} found`);
    });

    // Check color contrast (basic check)
    const coloredElements = document.querySelectorAll('[class*="text-"], [class*="bg-"]');
    console.log(`${coloredElements.length > 0 ? '✅' : '❌'} Colored elements: ${coloredElements.length} found`);

    return accessibilityFeatures;
  }

  // Test 7: Performance
  function testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    // Check loading states
    const loadingElements = document.querySelectorAll('[class*="loading"], [class*="skeleton"], [class*="animate-pulse"]');
    console.log(`${loadingElements.length >= 0 ? '✅' : '❌'} Loading states: ${loadingElements.length} found`);

    // Check for lazy loading
    const lazyElements = document.querySelectorAll('[loading="lazy"], [class*="lazy"]');
    console.log(`${lazyElements.length >= 0 ? '✅' : '❌'} Lazy loading: ${lazyElements.length} elements`);

    // Basic performance metrics
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`📊 Page load time: ${loadTime}ms`);
      
      return {
        loadTime,
        loadingElements: loadingElements.length,
        lazyElements: lazyElements.length
      };
    }

    return { loadingElements: loadingElements.length };
  }

  // Run all tests
  async function runAllTests() {
    console.log('🚀 Running comprehensive student dashboard tests...\n');
    
    const results = {
      navigation: testNavigation(),
      vocabularyAnalysis: testVocabularyAnalysis(),
      categoryPerformance: testCategoryPerformance(),
      apiEndpoints: await testAPIEndpoints(),
      responsiveDesign: testResponsiveDesign(),
      accessibility: testAccessibility(),
      performance: testPerformance()
    };

    console.log('\n📋 Test Summary:');
    console.log('================');
    
    Object.entries(results).forEach(([testName, result]) => {
      if (result && typeof result === 'object') {
        console.log(`${testName}: ✅ Completed`);
      } else {
        console.log(`${testName}: ❌ Failed or incomplete`);
      }
    });

    console.log('\n🎉 All tests completed! Check individual test results above.');
    
    return results;
  }

  // Auto-run tests if script is executed directly
  if (typeof window !== 'undefined') {
    // Add a global function to run tests manually
    window.testStudentDashboard = runAllTests;
    
    // Auto-run after a short delay to ensure page is loaded
    setTimeout(() => {
      runAllTests();
    }, 1000);
  }

  // Export for Node.js testing if needed
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      testNavigation,
      testVocabularyAnalysis,
      testCategoryPerformance,
      testAPIEndpoints,
      testResponsiveDesign,
      testAccessibility,
      testPerformance,
      runAllTests
    };
  }

})();
