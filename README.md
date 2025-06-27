# DNA Portals Automation Testing Framework

> **Note:** This project is an example of a test automation framework. The website under test is not available, so the tests are illustrative and cannot be executed end-to-end. The included Azure pipeline YAML is a draft version, intended to provide an idea of the pipeline structure rather than a complete, working CI/CD setup.

A robust end-to-end testing framework for DNA Portals applications using Playwright, TypeScript, and Azure DevOps CI/CD.

## Overview

This automation framework provides comprehensive test coverage for the DNA Portals pricing portal, specifically focusing on underwriting report functionality. The framework follows the Page Object Model (POM) design pattern for maintainable and scalable test automation.

## Features

- **Page Object Model (POM)**: Clean separation of test logic and page interactions
- **TypeScript**: Type-safe test development with better IDE support
- **Playwright**: Modern, reliable browser automation
- **Azure DevOps Integration**: Automated CI/CD pipeline with parallel test execution
- **Comprehensive Test Coverage**: Tests for Date Ranges, Products, Factors, and Subproducts tabs
- **API Integration**: Mock API responses for consistent test environments
- **Parallel Execution**: Optimized test execution with proper test isolation

## Test Coverage

### Underwriting Report Tests
- **Date Ranges Tab**: Date selection, validation, and navigation tests
- **Products Tab**: Product selection, multi-selection, and error handling
- **Factors Tab**: Factor selection, grouping, and validation
- **Subproducts Tab**: Subproduct selection and navigation


## Project Structure

```
dnaportals-automation/
├── tests/
│   └── pricing-portal/
│       ├── functional/
│       │   ├── underwriting-report-dateRanges.spec.ts
│       │   ├── underwriting-report-factors.spec.ts
│       │   ├── underwriting-report-product.spec.ts
│       │   └── underwriting-report-subproducts.spec.ts
│       └── e2e/
├── support/
│   ├── page-objects/
│   ├── components-objects/
│   ├── api-objects/
│   └── Utils/
├── playwright.config.ts
└── azure-pipelines.yml
```

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the automation directory
cd dnaportals/automation-tests/dnaportals-automation

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Local Execution
```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/pricing-portal/functional/underwriting-report-dateRanges.spec.ts

# Run tests in headed mode
npx playwright test --headed

# Run tests with specific browser
npx playwright test --project=chromium
```

### CI/CD Execution
Tests are automatically executed in Azure DevOps pipeline with:
- Parallel test execution across multiple agents
- Cross-browser testing (Chromium, Firefox, WebKit)
- Automated reporting and artifact collection

## CI/CD Pipeline

The Azure DevOps pipeline (`azure-pipelines.yml`) provides:
- **Trigger**: Runs on main branch pushes and pull requests
- **Parallel Execution**: Multiple agents for faster test completion
- **Cross-Browser Testing**: Tests across Chromium, Firefox, and WebKit
- **Artifact Collection**: Test results and screenshots for failed tests
- **Reporting**: Integration with Azure DevOps test reporting

## Contributing

1. Follow the existing code structure and naming conventions
2. Use the Page Object Model pattern for new page interactions
3. Write tests using the Given-When-Then pattern
4. Ensure proper test isolation and cleanup
5. Add appropriate assertions and error handling

## Author

**SGcipher** - [GitHub Profile](https://github.com/SGcipher)

--- 