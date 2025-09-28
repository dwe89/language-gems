import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

// Function to get all static pages from the app directory
function getAllPages(): { url: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] {
  const appDir = path.join(process.cwd(), 'src/app')
  const allPages: { url: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = []

  // Function to recursively find page.tsx files
  function findPages(dir: string, currentPath: string = ''): void {
    try {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const relativePath = currentPath ? `${currentPath}/${item}` : item

        // Skip dynamic routes, API routes, and special Next.js files
        if (item.includes('[') || item.includes(']') || item === 'api' || item.startsWith('_') || item.startsWith('.')) {
          continue
        }

        if (fs.statSync(fullPath).isDirectory()) {
          findPages(fullPath, relativePath)
        } else if (item === 'page.tsx') {
          // Convert file path to URL
          const url = currentPath ? `/${currentPath}` : ''

          // Determine priority and change frequency based on URL patterns
          let priority = 0.6 // default
          let changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'monthly'

          // High priority pages
          if (url === '' || url === '/about' || url === '/schools' || url === '/games' || url === '/vocabmaster' || url === '/blog' || url === '/grammar') {
            priority = 0.9
            changeFrequency = url === '' || url === '/games' || url === '/blog' || url === '/grammar' ? 'weekly' : 'monthly'
          }
          // Language hub pages
          else if (url.match(/^\/grammar\/(spanish|french|german)$/)) {
            priority = 0.9
            changeFrequency = 'weekly'
          }
          // High-value SEO content
          else if (url.includes('ser-vs-estar') || url.includes('por-vs-para') || url.includes('cases') || url.includes('imparfait') || url.includes('gcse') || url.includes('aqa') || url.includes('edexcel')) {
            priority = 0.9
            changeFrequency = 'monthly'
          }
          // Blog posts
          else if (url.startsWith('/blog/') && url !== '/blog') {
            priority = 0.8
            changeFrequency = 'monthly'
          }
          // Grammar pages
          else if (url.startsWith('/grammar/')) {
            priority = 0.8
            changeFrequency = 'monthly'
          }
          // Game pages
          else if (url.startsWith('/games/')) {
            priority = 0.8
            changeFrequency = 'weekly'
          }
          // Assessment pages
          else if (url.includes('assessment') || url.includes('test') || url.includes('exam')) {
            priority = 0.7
            changeFrequency = 'monthly'
          }
          // Legal pages
          else if (url.includes('privacy') || url.includes('terms') || url.includes('cookies')) {
            priority = 0.4
            changeFrequency = 'yearly'
          }
          // Other content pages
          else if (url.includes('vocabulary') || url.includes('songs') || url.includes('worksheets')) {
            priority = 0.8
            changeFrequency = 'weekly'
          }

          allPages.push({
            url,
            priority,
            changeFrequency
          })
        }
      }
    } catch (error) {
      console.warn(`Could not read directory ${dir}:`, error)
    }
  }

  findPages(appDir)
  return allPages.sort((a, b) => b.priority - a.priority) // Sort by priority
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://languagegems.com'
  const currentDate = new Date().toISOString()

  // Static routes with their priorities and change frequencies
  const routes = [
    // Main Pages - Highest Priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/schools`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact-sales`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/help-center`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },

    // Games Hub - Very High Priority
    {
      url: `${baseUrl}/games`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },

    // Individual Games - High Priority
    {
      url: `${baseUrl}/games/detective-listening`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/memory-game`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/hangman`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/noughts-and-crosses`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/word-towers`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/sentence-towers`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/word-scramble`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/vocab-blast`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/conjugation-duel`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/verb-quest`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },

    // VocabMaster - Flagship Feature
    {
      url: `${baseUrl}/vocabmaster`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },

    // Learning & Vocabulary
    {
      url: `${baseUrl}/vocabulary`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },

    // Songs Platform
    {
      url: `${baseUrl}/songs`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },

    // Worksheets
    {
      url: `${baseUrl}/worksheets`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },

    // Exams & Curriculum
    {
      url: `${baseUrl}/exams`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },

    // GCSE Language Learning Pages - High SEO Value
    {
      url: `${baseUrl}/gcse-language-learning`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gcse-spanish-learning`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gcse-french-learning`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gcse-german-learning`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },

    // Exam Board Specific GCSE Pages - High Priority SEO Pages
    {
      url: `${baseUrl}/aqa-spanish-gcse`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/aqa-french-gcse`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/aqa-german-gcse`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/edexcel-spanish-gcse`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/edexcel-french-gcse`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/edexcel-german-gcse`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },

    // Blog Posts - High SEO Value
    {
      url: `${baseUrl}/blog/ser-vs-estar-ultimate-guide-students`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/german-cases-explained-simple-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/imparfait-vs-passe-compose-simple-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/por-vs-para-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/jouer-a-vs-jouer-de-explained`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/best-vocabulary-learning-techniques-gcse`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/complete-guide-spaced-repetition-vocabulary-learning`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/complete-guide-gcse-spanish-vocabulary-themes`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/gcse-spanish-speaking-exam-tips`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/gcse-german-writing-exam-tips`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/everything-you-need-to-know-about-the-new-aqa-speaking-exam`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/gamification-language-learning-classroom`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/science-of-gamification-language-learning`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/spaced-repetition-vs-cramming`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/language-learning-apps-vs-educational-software`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/ks3-french-word-blast-game-better-than-flashcards`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/german-movies-tv-shows-listening-skills`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/pronunciation-in-the-reading-aloud-task`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },

    // Assessment & Testing Pages
    {
      url: `${baseUrl}/assessments`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/aqa-listening-test`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/aqa-reading-test`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/aqa-writing-test`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/edexcel-listening-test`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/four-skills-assessment`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reading-comprehension`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/dictation`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },

    // Grammar & Resources
    {
      url: `${baseUrl}/grammar`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },

    // Utility Pages
    {
      url: `${baseUrl}/sitemap`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },

    // Legal Pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
  ]

  // Add all grammar pages dynamically
  const grammarPages = getGrammarPages()
  grammarPages.forEach(page => {
    routes.push({
      url: `${baseUrl}${page.url}`,
      lastModified: currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  })

  return routes
}
