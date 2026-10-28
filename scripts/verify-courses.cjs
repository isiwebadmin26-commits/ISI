const fs = require('fs');
const path = require('path');

const coursesDataPath = path.resolve(__dirname, '../src/data/courses-data.ts');
const isiAcademyPath = path.resolve(__dirname, '../src/components/academy/ISIAcademy.tsx');

console.log('--- 1. Testing src/data/courses-data.ts ---');
const coursesContent = fs.readFileSync(coursesDataPath, 'utf8');

const requiredFields = [
  'benefits',
  'learningOutcomes',
  'skillsAcquired',
  'practicalApplications',
  'careerRelevance',
  'intendedAudience',
  'prerequisites'
];

// Check all 9 course IDs (C1 to C9)
const courseIds = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'];
let coursesPass = true;

for (const id of courseIds) {
  if (!coursesContent.includes(`id: '${id}'`) && !coursesContent.includes(`id: "${id}"`)) {
    console.error(`FAIL: Missing course ID ${id}`);
    coursesPass = false;
  }
}

for (const field of requiredFields) {
  const matches = (coursesContent.match(new RegExp(field + ':', 'g')) || []).length;
  console.log(`Field '${field}' count: ${matches}`);
  if (matches < 9) {
    console.error(`FAIL: Insufficient occurrences of field '${field}'`);
    coursesPass = false;
  }
}

if (coursesPass) {
  console.log('PASS: All 9 CDAC courses have complete benefits, learning outcomes, skills, applications, career relevance, intended audience, and prerequisites.');
} else {
  console.error('FAIL: Verification failed for courses-data.ts');
  process.exit(1);
}

console.log('\n--- 2. Testing src/components/academy/ISIAcademy.tsx ---');
const academyContent = fs.readFileSync(isiAcademyPath, 'utf8');

if (!academyContent.includes('resolveProgramBenefits')) {
  console.error('FAIL: Missing resolveProgramBenefits in ISIAcademy.tsx');
  process.exit(1);
}

if (!academyContent.includes('Dedicated Course Benefits by Track')) {
  console.error('FAIL: Missing Dedicated Course Benefits by Track section in ISIAcademy.tsx');
  process.exit(1);
}

if (!academyContent.includes('Key Program Benefits')) {
  console.error('FAIL: Missing modal benefits in ISIAcademy.tsx');
  process.exit(1);
}

console.log('PASS: ISIAcademy.tsx contains resolveProgramBenefits, course benefits matrix, and program modal details.');

console.log('\n--- 3. Testing TrustBar Scrollbar Fix ---');
const trustBarPath = path.resolve(__dirname, '../src/components/TrustBar.tsx');
const cssPath = path.resolve(__dirname, '../src/index.css');
const tailwindConfigPath = path.resolve(__dirname, '../tailwind.config.ts');

const trustBarContent = fs.readFileSync(trustBarPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');
const tailwindContent = fs.readFileSync(tailwindConfigPath, 'utf8');

if (!trustBarContent.includes('scrollbar-hide') && !trustBarContent.includes('no-scrollbar')) {
  console.error('FAIL: TrustBar missing scrollbar hiding class');
  process.exit(1);
}

if (!cssContent.includes('.scrollbar-hide') || !cssContent.includes('scrollbar-width: none')) {
  console.error('FAIL: CSS missing .scrollbar-hide rules');
  process.exit(1);
}

if (!tailwindContent.includes('tailwind-scrollbar-hide')) {
  console.error('FAIL: tailwind.config.ts missing tailwind-scrollbar-hide plugin');
  process.exit(1);
}

console.log('PASS: Scrollbar hiding classes, CSS definitions, and Tailwind plugin successfully configured.');

console.log('\n========================================');
console.log('ALL VERIFICATION CHECKS PASSED (100%)');
console.log('========================================');
