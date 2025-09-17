# Performance Testing Suite

Comprehensive performance tests for the AI Social Media Platform frontend to ensure <2s initial load and 60fps requirements.

## Performance Targets

- **Initial Load**: <2s for First Contentful Paint
- **Frame Rate**: 60fps consistently during animations
- **Lighthouse Score**: >90 performance score
- **Bundle Size**: <500KB gzipped
- **Memory**: No memory leaks during navigation (<10MB increase)
- **Real-time Updates**: Processed within 100ms

## Test Files

### load.performance.test.ts
Tests initial page load performance including:
- First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
- Lighthouse performance audit
- Bundle size analysis
- Critical rendering path optimization
- Image optimization and lazy loading
- JavaScript execution time
- Network performance on slow connections
- Caching strategies
- Resource preloading

### runtime.performance.test.ts
Tests runtime performance including:
- Animation performance (60fps requirement)
- Smooth scrolling performance
- Memory leak detection
- User interaction responsiveness
- Component rendering performance
- Real-time update efficiency (SSE/WebSocket)
- DOM operation performance
- Input responsiveness
- Accessibility performance
- Network throttling resilience

## Running Performance Tests

### Run all performance tests:
```bash
npm run test:perf
```

### Run specific test suites:
```bash
# Load performance tests only
npm run test:perf:load

# Runtime performance tests only
npm run test:perf:runtime
```

### Interactive UI mode:
```bash
npm run test:perf:ui
```

### Generate Lighthouse report:
```bash
npm run lighthouse
```

### Analyze bundle size:
```bash
npm run analyze
```

## Test Configuration

Performance tests use a specialized Playwright configuration (`playwright.performance.config.ts`) with:
- Headed mode for accurate metrics
- GPU acceleration enabled
- Precise memory measurement
- Video recording for analysis
- Full tracing enabled
- Single worker to avoid interference

## Test Projects

1. **chromium-performance**: Primary desktop testing with Chrome
2. **mobile-performance**: Mobile device testing (Pixel 5)
3. **slow-network**: Tests under slow 3G conditions
4. **throttled-cpu**: Tests with CPU throttling

## Performance Metrics

### Core Web Vitals
- **FCP**: First Contentful Paint (<2000ms)
- **LCP**: Largest Contentful Paint (<2500ms)
- **TBT**: Total Blocking Time (<300ms)
- **CLS**: Cumulative Layout Shift (<0.1)
- **TTI**: Time to Interactive (<3500ms)

### Custom Metrics
- **FPS**: Frame rate during animations (>55fps average)
- **Bundle Size**: Total JavaScript/CSS size (<500KB)
- **Memory Growth**: Per navigation cycle (<10MB)
- **Interaction Delay**: User input response (<100ms)
- **SSE Latency**: Server-sent event processing (<100ms)

## Reports

After running tests, the following reports are generated:

1. **HTML Report**: `playwright-performance-report/index.html`
2. **JSON Results**: `performance-results.json`
3. **Performance Summary**: `performance-summary.json`
4. **Lighthouse Report**: `lighthouse-report.json`
5. **Video Recordings**: `test-results/performance/*.webm`

## Performance Baseline

The test suite maintains a performance baseline (`performance-baseline.json`) that:
- Stores reference metrics for comparison
- Detects performance regressions (>10% degradation)
- Identifies improvements (>5% improvement)
- Helps track performance over time

## CI/CD Integration

For CI environments:
```yaml
# Example GitHub Actions workflow
- name: Run Performance Tests
  run: |
    npm ci
    npm run build
    npm run test:perf
  env:
    CI: true
```

## Debugging Performance Issues

1. **Review video recordings** in `test-results/performance/`
2. **Analyze trace files** using Playwright Trace Viewer
3. **Check detailed metrics** in performance-summary.json
4. **Use Chrome DevTools** with headed mode for live debugging
5. **Review Lighthouse suggestions** in the generated report

## Best Practices

1. Run tests on consistent hardware for reliable metrics
2. Close other applications to reduce interference
3. Run tests multiple times and average results
4. Update baseline metrics after confirmed improvements
5. Monitor trends over time, not just single results
6. Test both cold and warm cache scenarios
7. Include real-world network conditions in testing

## Troubleshooting

### Tests timing out
- Increase timeout in playwright.performance.config.ts
- Check if dev server is running properly
- Verify network connectivity

### Inconsistent results
- Ensure no other processes are consuming resources
- Run tests individually instead of in parallel
- Check for background browser extensions

### Memory measurements unavailable
- Ensure Chrome is launched with `--enable-precise-memory-info`
- Verify browser version supports memory API

## Dependencies

- `@playwright/test`: Test runner and browser automation
- `lighthouse`: Performance auditing
- `puppeteer-core`: Additional browser control for Lighthouse
- `web-vitals`: Core Web Vitals measurement
- `@axe-core/playwright`: Accessibility testing