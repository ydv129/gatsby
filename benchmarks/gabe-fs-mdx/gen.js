const fs = require('fs');
const path = require('path');
const faker = require('faker');

const N = parseInt(process.env.N, 10) || 100;
const ARTICLES_DIR = './generated_articles';

// Helper function to escape double quotes in a string
function escapeQuotes(str) {
  return str.replace(/"/g, '\\"');
}

// Function to create an article's content
function createArticle(n, sentence, slug) {
  const desc = faker.lorem.sentence();

  return `---
articleNumber: ${n}
title: "${escapeQuotes(sentence)}"
description: "${escapeQuotes(desc)}"
path: '${slug}'
date: ${faker.date.recent(1000).toISOString().slice(0, 10)}
---

import { Link } from "gatsby"

export const author = "Fred Flintstone"

<Link to="/">Go Home</Link>

# ${sentence}

> ${desc}

${faker.lorem.paragraphs(2)}
  `;
}

// Function to generate articles
function generateArticles(count) {
  console.log('Start of generation');
  
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  } else {
    const existingFiles = fs.readdirSync(ARTICLES_DIR).length;
    if (existingFiles >= count) {
      console.log(`Directory already contains ${existingFiles} files. No new files generated.`);
      return;
    }
  }

  console.log(`Generating ${count} articles...`);
  for (let i = 0; i < count; ++i) {
    const sentence = faker.lorem.sentence();
    const slug = faker.helpers.slugify(sentence).toLowerCase();
    const articlePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
    
    // Write article to file
    fs.writeFileSync(articlePath, createArticle(i, sentence, slug));
  }

  console.log(`Finished generating ${count} articles.`);
}

// Execute the generation process
generateArticles(N);
console.log('End of generation');
